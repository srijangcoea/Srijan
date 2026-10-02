import { Admin } from '../models/Admin.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { generateToken } from '../middleware/auth.js';

/**
 * POST /api/admin/login
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated.',
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Log the action
    await ActivityLog.create({
      adminId: admin._id,
      adminName: admin.name,
      action: 'LOGIN',
      details: `Admin "${admin.name}" logged in`,
    });

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: admin.toJSON(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/me
 * Returns the current admin profile
 */
export const getAdminProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.admin,
  });
};

/**
 * POST /api/admin/seed
 * Creates the default super_admin if none exist. Run once on first setup.
 */
export const seedAdmin = async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ role: 'super_admin' });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'A super admin already exists. Seed skipped.',
      });
    }

    const admin = await Admin.create({
      name: 'Srijan Admin',
      email: 'srijan.gcoea@gmail.com',            // ← EDIT: your admin email
      password: 'srijan2026',                       // ← EDIT: your admin password
      role: 'super_admin',
      assignedEvents: [],
    });

    res.status(201).json({
      success: true,
      message: 'Default super admin created successfully.',
      data: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
