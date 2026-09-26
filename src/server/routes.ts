import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from './db.js';
import { authenticate, optionalAuth, requireAdmin, generateToken, AuthenticatedRequest } from './auth.js';
import { findMatchesFor } from './matching.js';
import { ItemCategory, ItemStatus } from '../types/index.js';

export const apiRouter = express.Router();

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

apiRouter.post('/auth/register', (req: Request, res: Response): void => {
  const { name, email, studentId, department, year, password, confirmPassword } = req.body;

  if (!name || !email || !studentId || !department || !year || !password) {
    res.status(400).json({ error: 'All fields are required.' });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: 'Passwords do not match.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    return;
  }

  const existingEmail = db.users.findByEmail(email);
  if (existingEmail) {
    res.status(400).json({ error: 'An account with this college email already exists.' });
    return;
  }

  const existingStudent = db.users.findByStudentId(studentId);
  if (existingStudent) {
    res.status(400).json({ error: 'This Student ID is already registered.' });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser = db.users.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    studentId: studentId.trim().toUpperCase(),
    department: department.trim(),
    year: year.trim(),
    role: 'student',
    passwordHash,
  });

  const { passwordHash: _, ...safeUser } = newUser;
  const token = generateToken(safeUser);

  // Welcome notification
  db.notifications.create({
    userId: safeUser.id,
    title: 'Welcome to LostLink',
    message: 'Your campus account has been activated. You can now report lost or found belongings and track claims.',
    type: 'system',
    link: '/student/dashboard',
  });

  res.status(201).json({ user: safeUser, token });
});

apiRouter.post('/auth/login', (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = db.users.findByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid college email or password.' });
    return;
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid college email or password.' });
    return;
  }

  const { passwordHash: _, ...safeUser } = user;
  const token = generateToken(safeUser);

  res.json({ user: safeUser, token });
});

apiRouter.get('/auth/me', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  res.json({ user: req.user });
});

apiRouter.put('/auth/update-profile', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { name, department, year } = req.body;
  const userId = req.user!.id;

  const updated = db.users.update(userId, {
    ...(name ? { name: name.trim() } : {}),
    ...(department ? { department: department.trim() } : {}),
    ...(year ? { year: year.trim() } : {}),
  });

  if (!updated) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { passwordHash: _, ...safeUser } = updated;
  res.json({ user: safeUser });
});

// ==========================================
// 2. ITEMS (LOST & FOUND) ROUTES
// ==========================================

// Public & Filtered Items
apiRouter.get('/items', optionalAuth, (req: AuthenticatedRequest, res: Response): void => {
  const { type, category, status, location, search, reporterId } = req.query;

  let items = db.items.find();

  if (type) {
    items = items.filter(i => i.type === String(type).toLowerCase());
  }

  if (category && category !== 'All') {
    items = items.filter(i => i.category === category);
  }

  if (status && status !== 'All') {
    items = items.filter(i => i.status === status);
  }

  if (location && location !== 'All') {
    const locLower = String(location).toLowerCase();
    items = items.filter(i => i.location.toLowerCase().includes(locLower));
  }

  if (reporterId) {
    items = items.filter(i => i.reporterId === reporterId);
  }

  if (search) {
    const query = String(search).toLowerCase();
    items = items.filter(i =>
      i.name.toLowerCase().includes(query) ||
      i.description.toLowerCase().includes(query) ||
      i.location.toLowerCase().includes(query) ||
      i.reportId.toLowerCase().includes(query) ||
      i.category.toLowerCase().includes(query)
    );
  }

  res.json({ items });
});

// Recent items for homepage showcase
apiRouter.get('/items/recent', (_req: Request, res: Response): void => {
  const all = db.items.find();
  const recentLost = all.filter(i => i.type === 'lost').slice(0, 3);
  const recentFound = all.filter(i => i.type === 'found').slice(0, 3);

  res.json({
    recentLost,
    recentFound,
  });
});

// Item Details
apiRouter.get('/items/:id', (req: Request, res: Response): void => {
  const item = db.items.findById(req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  res.json({ item });
});

// Smart Rule-based Matches for an item
apiRouter.get('/items/:id/matches', (req: Request, res: Response): void => {
  const target = db.items.findById(req.params.id);
  if (!target) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }

  const allItems = db.items.find();
  const matches = findMatchesFor(target, allItems);
  res.json({ matches });
});

// Create Lost or Found Report
apiRouter.post('/items', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const {
    type,
    name,
    category,
    description,
    image,
    location,
    date,
    time,
    currentLocation,
    additionalDetails,
    contactPreference,
  } = req.body;

  if (!type || !name || !category || !description || !location || !date || !time) {
    res.status(400).json({ error: 'Please provide all required report fields.' });
    return;
  }

  const initialStatus: ItemStatus = type === 'lost' ? 'Lost' : 'Found';

  const newItem = db.items.create({
    type,
    name: name.trim(),
    category: category as ItemCategory,
    description: description.trim(),
    image: image || '',
    location: location.trim(),
    date,
    time,
    currentLocation: currentLocation ? currentLocation.trim() : undefined,
    additionalDetails: additionalDetails ? additionalDetails.trim() : undefined,
    contactPreference: contactPreference ? contactPreference.trim() : 'LostLink In-App Verification',
    status: initialStatus,
    reporterId: user.id,
    reporterName: user.name,
    reporterDepartment: user.department,
  });

  // Evaluate Rule-based Matches immediately!
  const allItems = db.items.find();
  const possibleMatches = findMatchesFor(newItem, allItems);

  if (possibleMatches.length > 0) {
    const topMatch = possibleMatches[0];
    // Notify the submitter
    db.notifications.create({
      userId: user.id,
      title: 'Possible Match Found',
      message: `A similar ${topMatch.item.type} item "${topMatch.item.name}" was found around ${topMatch.item.location}.`,
      type: 'match_found',
      link: `/item/${topMatch.item.id}`,
    });

    // Notify the other party if registered
    if (topMatch.item.reporterId) {
      db.notifications.create({
        userId: topMatch.item.reporterId,
        title: 'New Possible Match',
        message: `A new ${newItem.type} item report "${newItem.name}" matches your listing ${topMatch.item.reportId}.`,
        type: 'match_found',
        link: `/item/${newItem.id}`,
      });
    }
  }

  res.status(201).json({
    item: newItem,
    matchedCount: possibleMatches.length,
    matches: possibleMatches.slice(0, 2),
  });
});

// Update item (Admin or Reporter)
apiRouter.put('/items/:id', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const item = db.items.findById(req.params.id);

  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }

  if (user.role !== 'admin' && item.reporterId !== user.id) {
    res.status(403).json({ error: 'Unauthorized to modify this report.' });
    return;
  }

  const { name, category, description, location, status, currentLocation, additionalDetails } = req.body;

  const updated = db.items.update(item.id, {
    ...(name ? { name: name.trim() } : {}),
    ...(category ? { category } : {}),
    ...(description ? { description: description.trim() } : {}),
    ...(location ? { location: location.trim() } : {}),
    ...(status ? { status } : {}),
    ...(currentLocation !== undefined ? { currentLocation } : {}),
    ...(additionalDetails !== undefined ? { additionalDetails } : {}),
  });

  if (status === 'Returned' && item.reporterId) {
    db.notifications.create({
      userId: item.reporterId,
      title: 'Item Marked as Returned',
      message: `Your item "${item.name}" (${item.reportId}) has been successfully marked as returned.`,
      type: 'item_returned',
      link: `/student/dashboard`,
    });
  }

  res.json({ item: updated });
});

// Flag Suspicious Report
apiRouter.post('/items/:id/flag-suspicious', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { reason } = req.body;
  const item = db.items.findById(req.params.id);

  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }

  const updated = db.items.update(item.id, {
    isSuspicious: true,
    suspiciousReason: reason || 'Flagged for campus safety review by a user.',
  });

  res.json({ success: true, item: updated });
});

// Remove inappropriate report (Admin only)
apiRouter.delete('/items/:id', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const item = db.items.findById(req.params.id);

  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }

  if (user.role !== 'admin' && item.reporterId !== user.id) {
    res.status(403).json({ error: 'Unauthorized to delete this report.' });
    return;
  }

  db.items.delete(item.id);
  res.json({ success: true, message: 'Report removed successfully' });
});

// ==========================================
// 3. CLAIM REQUESTS & VERIFICATION
// ==========================================

// Get Claims
apiRouter.get('/claims', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  let claims;

  if (user.role === 'admin') {
    claims = db.claims.find();
  } else {
    claims = db.claims.find(c => c.claimantId === user.id);
  }

  res.json({ claims });
});

// Submit Claim Request
apiRouter.post('/claims', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const { itemId, answers, proofImage } = req.body;

  if (!itemId || !answers) {
    res.status(400).json({ error: 'Missing required claim parameters.' });
    return;
  }

  const item = db.items.findById(itemId);
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }

  if (item.type !== 'found') {
    res.status(400).json({ error: 'Claim requests can only be placed on found items.' });
    return;
  }

  // Check if claimant already has an active claim
  const existingClaims = db.claims.find(c => c.itemId === itemId && c.claimantId === user.id);
  if (existingClaims.length > 0) {
    res.status(400).json({ error: 'You have already submitted a claim verification for this item.' });
    return;
  }

  const newClaim = db.claims.create({
    itemId,
    claimantId: user.id,
    claimantName: user.name,
    claimantEmail: user.email,
    claimantStudentId: user.studentId,
    claimantDepartment: user.department,
    answers: {
      uniqueFeature: (answers.uniqueFeature || '').trim(),
      contentsInside: (answers.contentsInside || '').trim(),
      locationLost: (answers.locationLost || '').trim(),
      dateLost: (answers.dateLost || '').trim(),
    },
    proofImage: proofImage || '',
    status: 'Pending',
    adminComment: 'Awaiting review by Campus Safety & LostLink administrators.',
  });

  // Notify claimant
  db.notifications.create({
    userId: user.id,
    title: 'Claim Request Submitted',
    message: `Your ownership claim for "${item.name}" has been placed in the queue for campus verification.`,
    type: 'claim_submitted',
    link: '/student/dashboard',
  });

  res.status(201).json({ claim: newClaim });
});

// Review Claim (Admin Only)
apiRouter.put('/claims/:id/status', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  const { status, adminComment } = req.body;
  const claim = db.claims.findById(req.params.id);

  if (!claim) {
    res.status(404).json({ error: 'Claim not found' });
    return;
  }

  const updatedClaim = db.claims.update(claim.id, {
    status,
    adminComment: adminComment ? adminComment.trim() : claim.adminComment,
  });

  // Notify claimant about review status update
  const itemTitle = claim.item?.name || 'Item';
  let message = `Your claim status for "${itemTitle}" was updated to "${status}".`;
  if (adminComment) {
    message += ` Note: ${adminComment}`;
  }

  db.notifications.create({
    userId: claim.claimantId,
    title: `Claim ${status}`,
    message,
    type: 'claim_update',
    link: '/student/dashboard',
  });

  res.json({ claim: updatedClaim });
});

// ==========================================
// 4. QR TAG GENERATION & RECOVERY
// ==========================================

// Get user's QR tags
apiRouter.get('/qr-tags', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const tags = db.qrTags.find(q => q.ownerId === user.id);
  res.json({ tags });
});

// Generate new QR tag
apiRouter.post('/qr-tags', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const { itemName, category } = req.body;

  if (!itemName || !category) {
    res.status(400).json({ error: 'Item name and category are required to generate a tag.' });
    return;
  }

  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const tagCode = `LL-QR-${randomSuffix}`;

  const newTag = db.qrTags.create({
    ownerId: user.id,
    ownerName: user.name,
    ownerEmail: user.email,
    itemName: itemName.trim(),
    category,
    tagCode,
    active: true,
  });

  res.status(201).json({ tag: newTag });
});

// Public lookup when scanning QR code (Zero Personal Data Leaked!)
apiRouter.get('/qr-tags/lookup/:tagCode', (req: Request, res: Response): void => {
  const tag = db.qrTags.findByCode(req.params.tagCode);
  if (!tag) {
    res.status(404).json({ error: 'Invalid or unregistered LostLink QR Tag.' });
    return;
  }

  // Safe response: strictly item name, category, and active status. No student name/email/phone!
  res.json({
    tag: {
      tagCode: tag.tagCode,
      itemName: tag.itemName,
      category: tag.category,
      active: tag.active,
    },
  });
});

// Finder submits recovery information
apiRouter.post('/qr-tags/recover/:tagCode', (req: Request, res: Response): void => {
  const { finderName, finderContact, location, date, time, message, photo } = req.body;

  if (!location || !message) {
    res.status(400).json({ error: 'Please specify where the item was found and a brief message.' });
    return;
  }

  const result = db.qrTags.addRecovery(req.params.tagCode, {
    finderName: finderName ? finderName.trim() : 'Anonymous Student / Staff',
    finderContact: finderContact ? finderContact.trim() : undefined,
    location: location.trim(),
    date: date || new Date().toISOString().split('T')[0],
    time: time || 'Just now',
    message: message.trim(),
    photo: photo || '',
  });

  if (!result) {
    res.status(404).json({ error: 'LostLink QR Tag not found.' });
    return;
  }

  // Notify tag owner
  db.notifications.create({
    userId: result.tag.ownerId,
    title: 'Your Tagged Item Was Located!',
    message: `Someone scanned your LostLink QR tag on "${result.tag.itemName}" at ${location}. Message: "${message.substring(0, 80)}"`,
    type: 'qr_found',
    link: '/student/dashboard',
  });

  res.json({
    success: true,
    message: 'The item owner has been securely notified via LostLink! Thank you for being a helpful member of the campus community.',
  });
});

// ==========================================
// 5. NOTIFICATION CENTER
// ==========================================

apiRouter.get('/notifications', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const notifs = db.notifications.find(n => n.userId === user.id);
  const unreadCount = notifs.filter(n => !n.read).length;
  res.json({ notifications: notifs, unreadCount });
});

apiRouter.put('/notifications/:id/read', authenticate, (req: Request, res: Response): void => {
  const success = db.notifications.markRead(req.params.id);
  res.json({ success });
});

apiRouter.put('/notifications/read-all', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  db.notifications.markAllRead(user.id);
  res.json({ success: true });
});

// ==========================================
// 6. ADMIN DASHBOARD & METRICS
// ==========================================

apiRouter.get('/admin/stats', authenticate, requireAdmin, (_req: AuthenticatedRequest, res: Response): void => {
  const stats = db.getAdminStats();
  res.json({ stats });
});

apiRouter.get('/admin/users', authenticate, requireAdmin, (_req: AuthenticatedRequest, res: Response): void => {
  const users = db.users.find().map(u => {
    const { passwordHash: _, ...safe } = u;
    return safe;
  });
  res.json({ users });
});

apiRouter.delete('/admin/users/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user!.id === req.params.id) {
    res.status(400).json({ error: 'You cannot delete your own admin account.' });
    return;
  }

  const success = db.users.delete(req.params.id);
  res.json({ success });
});
