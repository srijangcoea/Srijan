import { Event } from '../models/Event.js';
import { initialEvents } from '../data/seedData.js';
import { checkDBConnection } from '../config/db.js';

/**
 * Get all events (auto-seeds if database is empty)
 */
export const getEvents = async (req, res, next) => {
  try {
    if (!checkDBConnection()) {
      return res.status(200).json({
        success: true,
        source: 'static',
        count: initialEvents.length,
        data: initialEvents,
      });
    }

    let events = await Event.find().sort({ slug: 1 }).lean();

    if (!events || events.length === 0) {
      await Event.insertMany(initialEvents);
      events = await Event.find().sort({ slug: 1 }).lean();
      console.log('🌱 [MongoDB] Auto-seeded initial Srijan events into database.');
    }

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
        data: { id, ...updates }
      });
    }

    const query = {
      $or: [{ slug: id.toLowerCase() }, { slug: `event-${id.toLowerCase()}` }, { code: id.toUpperCase() }]
    };
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      query.$or.push({ _id: id });
    }

    const updated = await Event.findOneAndUpdate(query, updates, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: `Event "${id}" not found.` });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};
