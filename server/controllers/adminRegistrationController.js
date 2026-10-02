import { Registration } from '../models/Registration.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { checkDBConnection } from '../config/db.js';

/**
 * PATCH /api/admin/registrations/:id/status
 * Update registration status (confirm, reject, cancel)
 */
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    const validStatuses = ['confirmed', 'cancelled', 'rejected', 'pending'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (status === 'rejected' && !rejectionReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when rejecting a registration.',
      });
    }

    const update = { status };
    if (status === 'rejected') {
      update.rejectionReason = rejectionReason.trim();
    }

    const reg = await Registration.findByIdAndUpdate(id, update, { new: true }).lean();

    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    // Log the action
    await ActivityLog.create({
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: `STATUS_CHANGE_${status.toUpperCase()}`,
      registrationId: reg.registrationId,
      details: `Changed status of ${reg.registrationId} to "${status}"${rejectionReason ? ` — Reason: ${rejectionReason}` : ''}`,
    });

    res.status(200).json({
      success: true,
      message: `Registration ${reg.registrationId} status updated to "${status}".`,
      data: reg,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/admin/registrations/bulk-status
 * Bulk status update
 */
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status, rejectionReason } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No registration IDs provided.' });
    }

    const validStatuses = ['confirmed', 'cancelled', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const update = { status };
    if (status === 'rejected' && rejectionReason) {
      update.rejectionReason = rejectionReason.trim();
    }

    const result = await Registration.updateMany({ _id: { $in: ids } }, update);

    // Log the bulk action
    await ActivityLog.create({
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: `BULK_${status.toUpperCase()}`,
      details: `Bulk ${status} applied to ${result.modifiedCount} registrations`,
    });

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} registrations updated to "${status}".`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/admin/registrations/bulk-delete
 * Bulk delete registrations
 */
export const bulkDeleteRegistrations = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No IDs provided.' });
    }

    const result = await Registration.deleteMany({ _id: { $in: ids } });

    await ActivityLog.create({
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: 'BULK_DELETE',
      details: `Deleted ${result.deletedCount} registrations`,
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} registrations deleted.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/registrations/dashboard
 * Full dashboard stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ success: false, message: 'Database not connected.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalRegistrations,
      confirmedCount,
      cancelledCount,
      registrationsToday,
      allRegistrations,
      eventStats,
      timelineData,
    ] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ status: 'confirmed' }),
      Registration.countDocuments({ status: { $in: ['cancelled', 'rejected'] } }),
      Registration.countDocuments({ createdAt: { $gte: today } }),
      Registration.find().lean(),
      Registration.aggregate([
        {
          $group: {
            _id: '$eventId',
            eventName: { $first: '$eventName' },
            count: { $sum: 1 },
            confirmed: {
              $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $in: ['$status', ['cancelled', 'rejected']] }, 1, 0] },
            },
          },
        },
        { $sort: { count: -1 } },
      ]),
      Registration.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 30 },
      ]),
    ]);

    // Compute total participants (leader + members for teams, 1 for individuals)
    let totalParticipants = 0;
    allRegistrations.forEach((reg) => {
      if (reg.registrationType === 'team') {
        totalParticipants += 1 + (reg.members?.length || 0);
      } else {
        totalParticipants += 1;
      }
    });

    // Recent 10 registrations
    const recentRegistrations = allRegistrations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    // Status distribution
    const pendingCount = totalRegistrations - confirmedCount - cancelledCount;

    res.status(200).json({
      success: true,
      data: {
        kpi: {
          totalRegistrations,
          totalParticipants,
          confirmed: confirmedCount,
          pending: pendingCount,
          rejected: cancelledCount,
          registrationsToday,
        },
        eventStats,
        timelineData: timelineData.map((d) => ({
          date: d._id,
          count: d.count,
        })),
        recentRegistrations,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
