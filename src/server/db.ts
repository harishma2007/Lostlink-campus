import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Item, Claim, NotificationItem, QRTag, AdminStats, QRRecoveryLog } from '../types/index.js';

interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  items: Item[];
  claims: Claim[];
  notifications: NotificationItem[];
  qrTags: QRTag[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'lostlink.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbData: DatabaseSchema = {
  users: [],
  items: [],
  claims: [],
  notifications: [],
  qrTags: [],
};

// Seed realistic sample data
const seedDatabase = () => {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('Admin@123', salt);
  const studentPasswordHash = bcrypt.hashSync('Student@123', salt);

  const adminUser = {
    id: 'usr-admin-01',
    name: 'Dr. Evelyn Reed (Campus Safety Admin)',
    email: 'admin@campus.edu',
    studentId: 'FAC-SAFE-2024',
    department: 'Campus Safety & Student Affairs',
    year: 'Faculty / Staff',
    role: 'admin' as const,
    passwordHash: adminPasswordHash,
    createdAt: '2026-01-10T08:00:00.000Z',
  };

  const studentAlex = {
    id: 'usr-stu-01',
    name: 'Alex Chen',
    email: 'alex.chen@campus.edu',
    studentId: 'STU-2024-8841',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    role: 'student' as const,
    passwordHash: studentPasswordHash,
    createdAt: '2026-02-01T09:30:00.000Z',
  };

  const studentPriya = {
    id: 'usr-stu-02',
    name: 'Priya Patel',
    email: 'priya.patel@campus.edu',
    studentId: 'STU-2023-4120',
    department: 'Electrical Engineering',
    year: '4th Year',
    role: 'student' as const,
    passwordHash: studentPasswordHash,
    createdAt: '2026-02-05T14:15:00.000Z',
  };

  const studentMarcus = {
    id: 'usr-stu-03',
    name: 'Marcus Vance',
    email: 'marcus.v@campus.edu',
    studentId: 'STU-2025-1109',
    department: 'Mechanical Engineering',
    year: '2nd Year',
    role: 'student' as const,
    passwordHash: studentPasswordHash,
    createdAt: '2026-02-12T11:00:00.000Z',
  };

  const items: Item[] = [
    {
      id: 'itm-001',
      reportId: 'FR-2026-00102',
      type: 'found',
      name: 'Black Wireless Earbuds in Matte Case',
      category: 'Electronics',
      description: 'Found on a study desk next to the whiteboard in CSE Block 3rd floor lounge. Matte black case with faint scratch on the corner.',
      image: '/src/assets/images/item_black_earbuds_1790444233242.jpg',
      location: 'CSE Block (3rd Floor Tech Lounge)',
      date: '2026-09-24',
      time: '14:30',
      currentLocation: 'Campus Security Office Desk 3',
      additionalDetails: 'Battery LED indicator turns amber when opened.',
      contactPreference: 'Campus Security Desk',
      status: 'Found',
      reporterId: 'usr-stu-02',
      reporterName: 'Priya Patel',
      reporterDepartment: 'Electrical Engineering',
      createdAt: '2026-09-24T14:45:00.000Z',
    },
    {
      id: 'itm-002',
      reportId: 'LL-2026-00125',
      type: 'lost',
      name: 'Black Boat Airdopes Wireless Earbuds',
      category: 'Electronics',
      description: 'Misplaced my black wireless earbuds case after attending Algorithm Design lecture in CSE Block. Case has a tiny green sticker.',
      image: '/src/assets/images/item_black_earbuds_1790444233242.jpg',
      location: 'CSE Block (Lecture Hall 301)',
      date: '2026-09-24',
      time: '13:50',
      additionalDetails: 'Earbuds model Boat 141 with custom silicone tips.',
      contactPreference: 'LostLink Verified Claim',
      status: 'Lost',
      reporterId: 'usr-stu-01',
      reporterName: 'Alex Chen',
      reporterDepartment: 'Computer Science & Engineering',
      createdAt: '2026-09-24T15:20:00.000Z',
    },
    {
      id: 'itm-003',
      reportId: 'FR-2026-00108',
      type: 'found',
      name: 'Navy Blue College Laptop Backpack',
      category: 'Bags',
      description: 'Navy blue water-resistant backpack left on the 2nd floor library study carrel beside the reference section.',
      image: '/src/assets/images/item_blue_backpack_1790444244582.jpg',
      location: 'Central Library (2nd Floor Reading Room)',
      date: '2026-09-25',
      time: '17:15',
      currentLocation: 'Library Circulation Desk, 1st Floor',
      additionalDetails: 'Has a metal carabiner on the front zipper and university sports tag.',
      contactPreference: 'Library Staff',
      status: 'Claim Pending',
      reporterId: 'usr-stu-03',
      reporterName: 'Marcus Vance',
      reporterDepartment: 'Mechanical Engineering',
      createdAt: '2026-09-25T17:30:00.000Z',
    },
    {
      id: 'itm-004',
      reportId: 'LL-2026-00130',
      type: 'lost',
      name: 'Advanced Engineering Mathematics Textbook',
      category: 'Books',
      description: 'Hardcover 10th edition Erwin Kreyszig textbook with highlighted yellow chapters on vector calculus. Urgent for midterm exam.',
      image: '/src/assets/images/item_engineering_book_1790444256253.jpg',
      location: 'Mechanical Engg Block (Lecture Room B)',
      date: '2026-09-23',
      time: '11:15',
      additionalDetails: 'Front page has pencil calculations on margin.',
      contactPreference: 'LostLink Notification',
      status: 'Lost',
      reporterId: 'usr-stu-03',
      reporterName: 'Marcus Vance',
      reporterDepartment: 'Mechanical Engineering',
      createdAt: '2026-09-23T12:00:00.000Z',
    },
    {
      id: 'itm-005',
      reportId: 'FR-2026-00095',
      type: 'found',
      name: 'Campus Student ID Card & Lanyard',
      category: 'ID Cards',
      description: 'Official student card in emerald green campus lanyard found under a dining table.',
      image: '',
      location: 'Student Activity Center (Main Cafeteria)',
      date: '2026-09-22',
      time: '13:00',
      currentLocation: 'Student Union Help Desk',
      additionalDetails: 'Kept safely with receptionist.',
      contactPreference: 'Help Desk',
      status: 'Verified',
      reporterId: 'usr-stu-01',
      reporterName: 'Alex Chen',
      reporterDepartment: 'Computer Science & Engineering',
      createdAt: '2026-09-22T13:30:00.000Z',
    },
    {
      id: 'itm-006',
      reportId: 'LL-2026-00115',
      type: 'lost',
      name: 'Dark Brown Leather Bifold Wallet',
      category: 'Wallets',
      description: 'Lost during evening basketball practice near the courts. Contains hostel gate pass and metro card.',
      image: '',
      location: 'Sports Complex (Basketball Courts)',
      date: '2026-09-20',
      time: '19:45',
      additionalDetails: 'Reconnected safely via security verification.',
      contactPreference: 'Campus Security',
      status: 'Returned',
      reporterId: 'usr-stu-02',
      reporterName: 'Priya Patel',
      reporterDepartment: 'Electrical Engineering',
      createdAt: '2026-09-20T20:10:00.000Z',
    },
    {
      id: 'itm-007',
      reportId: 'FR-2026-00114',
      type: 'found',
      name: 'Set of 3 Brass House Keys with Red Tag',
      category: 'Keys',
      description: 'Found hanging on the handlebar of a parked bicycle near the north parking shed.',
      image: '',
      location: 'North Campus Bicycle Stand',
      date: '2026-09-25',
      time: '09:00',
      currentLocation: 'North Gate Security Guard Post',
      additionalDetails: 'Red tag has room number handwritten on one side.',
      contactPreference: 'Gate Security',
      status: 'Found',
      reporterId: 'usr-stu-01',
      reporterName: 'Alex Chen',
      reporterDepartment: 'Computer Science & Engineering',
      createdAt: '2026-09-25T09:20:00.000Z',
    },
  ];

  const claims: Claim[] = [
    {
      id: 'clm-001',
      itemId: 'itm-003',
      claimantId: 'usr-stu-01',
      claimantName: 'Alex Chen',
      claimantEmail: 'alex.chen@campus.edu',
      claimantStudentId: 'STU-2024-8841',
      claimantDepartment: 'Computer Science & Engineering',
      answers: {
        uniqueFeature: 'Silver metal carabiner clipped to front pouch with a subtle university logo sticker on bottom strap.',
        contentsInside: 'Contains a 14-inch grey laptop, blue spiral notes for CSE302, and an orange stainless steel water flask.',
        locationLost: 'Central Library 2nd floor desk near reference shelves.',
        dateLost: '2026-09-25',
      },
      proofImage: '',
      status: 'Under Review',
      adminComment: 'Claimant provided matching description of laptop brand and notebook titles. Pending student identification at circulation desk.',
      createdAt: '2026-09-25T18:10:00.000Z',
      updatedAt: '2026-09-25T19:00:00.000Z',
    },
  ];

  const qrTags: QRTag[] = [
    {
      id: 'tag-001',
      ownerId: 'usr-stu-01',
      ownerName: 'Alex Chen',
      ownerEmail: 'alex.chen@campus.edu',
      itemName: 'MacBook Pro 14 M3',
      category: 'Electronics',
      tagCode: 'LL-QR-84920',
      active: true,
      createdAt: '2026-09-15T10:00:00.000Z',
      recoveries: [
        {
          id: 'rec-001',
          finderName: 'Campus Facility Staff',
          finderContact: 'facility@campus.edu',
          location: 'Auditorium Hall B, Seat 42',
          date: '2026-09-18',
          time: '17:00',
          message: 'Found after university tech symposium lecture. Kept at Stage Manager booth.',
          createdAt: '2026-09-18T17:15:00.000Z',
        },
      ],
    },
    {
      id: 'tag-002',
      ownerId: 'usr-stu-02',
      ownerName: 'Priya Patel',
      ownerEmail: 'priya.patel@campus.edu',
      itemName: 'Graphing Calculator TI-84 Plus',
      category: 'Electronics',
      tagCode: 'LL-QR-12044',
      active: true,
      createdAt: '2026-09-18T11:00:00.000Z',
      recoveries: [],
    },
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif-001',
      userId: 'usr-stu-01',
      title: 'Claim Under Review',
      message: 'Your claim request for "Navy Blue College Laptop Backpack" (FR-2026-00108) is currently under review by Campus Safety Admin.',
      type: 'claim_update',
      link: '/student/dashboard',
      read: false,
      createdAt: '2026-09-25T19:00:00.000Z',
    },
    {
      id: 'notif-002',
      userId: 'usr-stu-01',
      title: 'Possible Match Found',
      message: 'A found item "Black Wireless Earbuds" at CSE Block matches your lost report LL-2026-00125.',
      type: 'match_found',
      link: '/item/itm-001',
      read: false,
      createdAt: '2026-09-24T15:25:00.000Z',
    },
    {
      id: 'notif-003',
      userId: 'usr-stu-02',
      title: 'Item Returned Safely',
      message: 'Your lost report "Dark Brown Leather Bifold Wallet" was marked as successfully returned.',
      type: 'item_returned',
      link: '/student/dashboard',
      read: true,
      createdAt: '2026-09-21T10:00:00.000Z',
    },
  ];

  return {
    users: [adminUser, studentAlex, studentPriya, studentMarcus],
    items,
    claims,
    notifications,
    qrTags,
  };
};

export const loadDb = (): DatabaseSchema => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbData = JSON.parse(content);
      return dbData;
    }
  } catch (err) {
    console.warn('Failed to parse database file, re-seeding:', err);
  }

  dbData = seedDatabase();
  saveDb();
  return dbData;
};

export const saveDb = (): void => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database file:', err);
  }
};

// Initial load
loadDb();

// DB accessor methods
export const db = {
  users: {
    find: (predicate?: (u: (User & { passwordHash: string })) => boolean) => {
      loadDb();
      return predicate ? dbData.users.filter(predicate) : dbData.users;
    },
    findById: (id: string) => {
      loadDb();
      return dbData.users.find(u => u.id === id);
    },
    findByEmail: (email: string) => {
      loadDb();
      return dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    findByStudentId: (studentId: string) => {
      loadDb();
      return dbData.users.find(u => u.studentId.toUpperCase() === studentId.toUpperCase());
    },
    create: (userData: Omit<User, 'id' | 'createdAt'> & { passwordHash: string }) => {
      loadDb();
      const newUser = {
        ...userData,
        id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      dbData.users.push(newUser);
      saveDb();
      return newUser;
    },
    update: (id: string, updates: Partial<User & { passwordHash?: string }>) => {
      loadDb();
      const idx = dbData.users.findIndex(u => u.id === id);
      if (idx === -1) return null;
      dbData.users[idx] = { ...dbData.users[idx], ...updates };
      saveDb();
      return dbData.users[idx];
    },
    delete: (id: string) => {
      loadDb();
      const idx = dbData.users.findIndex(u => u.id === id);
      if (idx === -1) return false;
      dbData.users.splice(idx, 1);
      saveDb();
      return true;
    },
  },

  items: {
    find: (predicate?: (item: Item) => boolean) => {
      loadDb();
      return predicate ? dbData.items.filter(predicate) : dbData.items;
    },
    findById: (id: string) => {
      loadDb();
      return dbData.items.find(item => item.id === id);
    },
    findByReportId: (reportId: string) => {
      loadDb();
      return dbData.items.find(item => item.reportId.toUpperCase() === reportId.toUpperCase());
    },
    create: (itemData: Omit<Item, 'id' | 'createdAt' | 'reportId'>) => {
      loadDb();
      const year = new Date().getFullYear();
      const prefix = itemData.type === 'lost' ? 'LL' : 'FR';
      const seq = Math.floor(10000 + Math.random() * 90000);
      const reportId = `${prefix}-${year}-${seq}`;

      const newItem: Item = {
        ...itemData,
        id: `itm-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        reportId,
        createdAt: new Date().toISOString(),
      };
      dbData.items.unshift(newItem);
      saveDb();
      return newItem;
    },
    update: (id: string, updates: Partial<Item>) => {
      loadDb();
      const idx = dbData.items.findIndex(item => item.id === id);
      if (idx === -1) return null;
      dbData.items[idx] = { ...dbData.items[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDb();
      return dbData.items[idx];
    },
    delete: (id: string) => {
      loadDb();
      const idx = dbData.items.findIndex(item => item.id === id);
      if (idx === -1) return false;
      dbData.items.splice(idx, 1);
      saveDb();
      return true;
    },
  },

  claims: {
    find: (predicate?: (c: Claim) => boolean) => {
      loadDb();
      const claims = predicate ? dbData.claims.filter(predicate) : dbData.claims;
      return claims.map(c => ({
        ...c,
        item: dbData.items.find(item => item.id === c.itemId),
      }));
    },
    findById: (id: string) => {
      loadDb();
      const c = dbData.claims.find(claim => claim.id === id);
      if (!c) return null;
      return {
        ...c,
        item: dbData.items.find(item => item.id === c.itemId),
      };
    },
    create: (claimData: Omit<Claim, 'id' | 'createdAt' | 'updatedAt' | 'item'>) => {
      loadDb();
      const now = new Date().toISOString();
      const newClaim: Claim = {
        ...claimData,
        id: `clm-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: now,
        updatedAt: now,
      };
      dbData.claims.unshift(newClaim);

      // Update item status to 'Claim Pending' if it's currently 'Found'
      const item = dbData.items.find(i => i.id === claimData.itemId);
      if (item && item.status === 'Found') {
        item.status = 'Claim Pending';
      }

      saveDb();
      return {
        ...newClaim,
        item,
      };
    },
    update: (id: string, updates: Partial<Claim>) => {
      loadDb();
      const idx = dbData.claims.findIndex(c => c.id === id);
      if (idx === -1) return null;
      dbData.claims[idx] = {
        ...dbData.claims[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // If approved or completed, update item status
      if (updates.status === 'Completed' || updates.status === 'Approved') {
        const item = dbData.items.find(i => i.id === dbData.claims[idx].itemId);
        if (item) {
          item.status = updates.status === 'Completed' ? 'Returned' : 'Verified';
        }
      }

      saveDb();
      return {
        ...dbData.claims[idx],
        item: dbData.items.find(i => i.id === dbData.claims[idx].itemId),
      };
    },
  },

  notifications: {
    find: (predicate?: (n: NotificationItem) => boolean) => {
      loadDb();
      return predicate ? dbData.notifications.filter(predicate) : dbData.notifications;
    },
    create: (notifData: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
      loadDb();
      const newNotif: NotificationItem = {
        ...notifData,
        id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      dbData.notifications.unshift(newNotif);
      saveDb();
      return newNotif;
    },
    markRead: (id: string) => {
      loadDb();
      const notif = dbData.notifications.find(n => n.id === id);
      if (notif) {
        notif.read = true;
        saveDb();
        return true;
      }
      return false;
    },
    markAllRead: (userId: string) => {
      loadDb();
      dbData.notifications.forEach(n => {
        if (n.userId === userId) n.read = true;
      });
      saveDb();
      return true;
    },
  },

  qrTags: {
    find: (predicate?: (q: QRTag) => boolean) => {
      loadDb();
      return predicate ? dbData.qrTags.filter(predicate) : dbData.qrTags;
    },
    findByCode: (tagCode: string) => {
      loadDb();
      return dbData.qrTags.find(q => q.tagCode.toUpperCase() === tagCode.toUpperCase());
    },
    create: (tagData: Omit<QRTag, 'id' | 'createdAt' | 'recoveries'>) => {
      loadDb();
      const newTag: QRTag = {
        ...tagData,
        id: `tag-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
        recoveries: [],
      };
      dbData.qrTags.unshift(newTag);
      saveDb();
      return newTag;
    },
    addRecovery: (tagCode: string, recovery: Omit<QRRecoveryLog, 'id' | 'createdAt'>) => {
      loadDb();
      const tag = dbData.qrTags.find(q => q.tagCode.toUpperCase() === tagCode.toUpperCase());
      if (!tag) return null;
      const newRec: QRRecoveryLog = {
        ...recovery,
        id: `rec-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      tag.recoveries.unshift(newRec);
      saveDb();
      return { tag, recovery: newRec };
    },
  },

  getAdminStats: (): AdminStats => {
    loadDb();
    const totalUsers = dbData.users.length;
    const totalStudents = dbData.users.filter(u => u.role === 'student').length;
    const totalLost = dbData.items.filter(i => i.type === 'lost').length;
    const totalFound = dbData.items.filter(i => i.type === 'found').length;
    const pendingClaims = dbData.claims.filter(c => c.status === 'Pending' || c.status === 'Under Review').length;
    const returnedItems = dbData.items.filter(i => i.status === 'Returned').length;
    const suspiciousReports = dbData.items.filter(i => i.isSuspicious).length;

    // Items by Category
    const categoryMap: Record<string, number> = {};
    dbData.items.forEach(i => {
      categoryMap[i.category] = (categoryMap[i.category] || 0) + 1;
    });
    const itemsByCategory = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count,
    }));

    // Reports by Location
    const locationMap: Record<string, number> = {};
    dbData.items.forEach(i => {
      const locKey = i.location.split('(')[0].trim();
      locationMap[locKey] = (locationMap[locKey] || 0) + 1;
    });
    const reportsByLocation = Object.entries(locationMap)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const monthlyRecovery = [
      { month: 'Jun', lost: 12, found: 10, returned: 8 },
      { month: 'Jul', lost: 15, found: 13, returned: 11 },
      { month: 'Aug', lost: 24, found: 22, returned: 19 },
      { month: 'Sep', lost: 31, found: 28, returned: 24 },
    ];

    return {
      totalUsers,
      totalStudents,
      totalLost,
      totalFound,
      pendingClaims,
      returnedItems,
      suspiciousReports,
      itemsByCategory,
      reportsByLocation,
      monthlyRecovery,
    };
  },
};
