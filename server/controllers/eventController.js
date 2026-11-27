import { Event } from '../models/Event.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { initialEvents } from '../data/seedData.js';
import { checkDBConnection } from '../config/db.js';

const logAdminAction = async (req, action, details) => {
  try {
    if (req.admin && checkDBConnection()) {
      await ActivityLog.create({
        adminId: req.admin._id,
        adminName: req.admin.name || req.admin.email,
        action,
        details,
      });
    }
  } catch (err) {
    console.warn('ActivityLog write skipped:', err.message);
  }
};

/**
 * Get all events (auto-seeds if database is empty)
 * Supports ?includeDrafts=true for admin CMS
 */
export const getEvents = async (req, res, next) => {
  try {
    const includeDrafts = req.query.includeDrafts === 'true';

    if (!checkDBConnection()) {
      return res.status(200).json({
        success: true,
        source: 'static',
        count: initialEvents.length,
        data: initialEvents,
      });
    }

    const totalCount = await Event.countDocuments();
    if (totalCount === 0) {
      await Event.insertMany(initialEvents);
      console.log('🌱 [MongoDB] Auto-seeded initial Srijan events into database.');
    }

    const filter = includeDrafts
      ? {}
      : { status: { $ne: 'draft' }, visible: { $ne: false } };

    const events = await Event.find(filter).sort({ order: 1, slug: 1 }).lean();

    res.status(200).json({
      success: true,
      source: 'database',
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single event by slug, code, or ID
 */
export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lowerId = id.toLowerCase();

    if (!checkDBConnection()) {
      const fallback = initialEvents.find(
        (e) => e.slug === lowerId || e.slug === `event-${lowerId}` || e.code?.toLowerCase() === lowerId
      );

      if (!fallback) {
        return res.status(404).json({ success: false, message: `Event "${id}" not found.` });
      }
      return res.status(200).json({ success: true, source: 'static', data: fallback });
    }

    const query = {
      $or: [{ slug: lowerId }, { slug: `event-${lowerId}` }, { code: id.toUpperCase() }],
    };

    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      query.$or.push({ _id: id });
    }

    const event = await Event.findOne(query).lean();

    if (!event) {
      return res.status(404).json({ success: false, message: `Event "${id}" not found.` });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new event (admin only)
 */
export const createEvent = async (req, res, next) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ success: false, message: 'Database unavailable.' });
    }

    const payload = { ...req.body };
    if (!payload.slug && payload.name) {
      payload.slug = payload.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const created = await Event.create(payload);
    await logAdminAction(req, 'CMS_EVENT_CREATED', `Created event "${created.name}" (${created.code})`);

    res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update event configuration (admin only)
 */
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!checkDBConnection()) {
      return res.status(200).json({
        success: true,
        message: 'Event updated in-memory (DB disconnected).',
        data: { id, ...updates },
      });
    }

    const query = {
      $or: [{ slug: id.toLowerCase() }, { slug: `event-${id.toLowerCase()}` }, { code: id.toUpperCase() }],
    };
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      query.$or.push({ _id: id });
    }

    const updated = await Event.findOneAndUpdate(query, updates, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: `Event "${id}" not found.` });
    }

    await logAdminAction(req, 'CMS_EVENT_UPDATED', `Updated event "${updated.name}" (${updated.status})`);

    res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an event (admin only)
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!checkDBConnection()) {
      return res.status(503).json({ success: false, message: 'Database unavailable.' });
    }

    const query = {
      $or: [{ slug: id.toLowerCase() }, { code: id.toUpperCase() }],
    };
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      query.$or.push({ _id: id });
    }

    const deleted = await Event.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Event "${id}" not found.` });
    }

    await logAdminAction(req, 'CMS_EVENT_DELETED', `Deleted event "${deleted.name}"`);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
