import { Attendance } from '../models/Attendance.js';
import { Registration } from '../models/Registration.js';
import { ActivityLog } from '../models/ActivityLog.js';

/**
 * POST /api/admin/attendance/mark
 */
export const markAttendance = async (req, res) => {
  try {
    const { registrationId, present } = req.body;

    if (!registrationId) {
      return res.status(400).json({ success: false, message: 'Registration ID is required.' });
    }

    // Find the registration to get event info
    const reg = await Registration.findOne({
      registrationId: registrationId.toUpperCase().trim(),
    }).lean();

    if (!reg) {
      return res.status(404).json({
        success: false,
        message: `Registration "${registrationId}" not found.`,
      });
    }

    const participantName =
      reg.registrationType === 'team'
        ? reg.teamLeader?.name || reg.teamName
        : reg.participant?.name || 'Unknown';

    // Upsert attendance record
    const attendance = await Attendance.findOneAndUpdate(
      { registrationId: reg.registrationId },
      {
        registrationId: reg.registrationId,
        eventId: reg.eventId,
        eventName: reg.eventName,
        participantName,
        present: present !== false,
        markedAt: new Date(),
        markedBy: req.admin._id,
      },
      { upsert: true, new: true }
    );

    await ActivityLog.create({
      adminId: req.admin._id,
      adminName: req.admin.name,
      action: present !== false ? 'MARK_PRESENT' : 'MARK_ABSENT',
      registrationId: reg.registrationId,
      details: `Marked ${reg.registrationId} (${participantName}) as ${present !== false ? 'present' : 'absent'}`,
    });

    res.status(200).json({
      success: true,
      message: `${reg.registrationId} marked as ${present !== false ? 'present' : 'absent'}.`,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/attendance
 * Get attendance list with filters
 */
export const getAttendance = async (req, res) => {
  try {
    const { eventId, search } = req.query;
    const filter = {};

    if (eventId && eventId !== 'all') {
      filter.eventId = eventId;
    }

    if (search?.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { registrationId: regex },
        { participantName: regex },
      ];
    }

    const records = await Attendance.find(filter)
      .sort({ markedAt: -1 })
      .lean();

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/attendance/stats
 */
export const getAttendanceStats = async (req, res) => {
  try {
    const stats = await Attendance.aggregate([
      {
        $group: {
          _id: '$eventId',
          eventName: { $first: '$eventName' },
          total: { $sum: 1 },
          present: { $sum: { $cond: ['$present', 1, 0] } },
          absent: { $sum: { $cond: ['$present', 0, 1] } },
        },
      },
    ]);

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
