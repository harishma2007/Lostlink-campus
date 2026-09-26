import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types/index.js';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'lostlink_super_secure_campus_secret_key_2026';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const generateToken = (user: User): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      studentId: user.studentId,
      department: user.department,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication token required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = db.users.findById(payload.id);
    if (!user) {
      res.status(401).json({ error: 'User not found or session expired' });
      return;
    }
    // Remove passwordHash before attaching
    const { passwordHash: _, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = db.users.findById(payload.id);
      if (user) {
        const { passwordHash: _, ...safeUser } = user;
        req.user = safeUser;
      }
    } catch {
      // Continue unauthenticated
    }
  }
  next();
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied: Admin credentials required' });
    return;
  }
  next();
};
