import express from 'express';
import { loginAdmin, getAdminProfile, seedAdmin } from '../controllers/adminController.js';
import {
  updateRegistrationStatus,
  bulkUpdateStatus,
  bulkDeleteRegistrations,
  getDashboardStats,
} from '../controllers/adminRegistrationController.js';
import {
  markAttendance,
  getAttendance,
  getAttendanceStats,
} from '../controllers/attendanceController.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { protect, superAdminOnly } from '../middleware/auth.js';

const router = express.Router();

// ─── Public ────────────────────────────────────────────
router.post('/login', loginAdmin);
router.post('/seed', seedAdmin);                    // Run once to create default admin

// ─── Protected (requires JWT) ──────────────────────────
router.use(protect);

router.get('/me', getAdminProfile);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Registration management
router.patch('/registrations/:id/status', updateRegistrationStatus);
router.post('/registrations/bulk-status', bulkUpdateStatus);
router.post('/registrations/bulk-delete', bulkDeleteRegistrations);

// Attendance
router.post('/attendance/mark', markAttendance);
router.get('/attendance', getAttendance);
router.get('/attendance/stats', getAttendanceStats);

// Activity log
router.get('/activity-log', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      ActivityLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ActivityLog.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
