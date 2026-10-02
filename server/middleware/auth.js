import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'srijan2026-admin-secret-key';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate JWT token for an admin
 */
export const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Middleware: Protect routes — requires valid JWT
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or deactivated.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired.',
    });
  }
};

/**
 * Middleware: Restrict to super_admin role only
 */
export const superAdminOnly = (req, res, next) => {
  if (req.admin?.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super admin privileges required.',
    });
  }
  next();
};
