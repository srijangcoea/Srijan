import { Registration } from '../models/Registration.js';
import { Event } from '../models/Event.js';
import { initialEvents } from '../data/seedData.js';
import { generateRegistrationId } from '../utils/generateRegistrationId.js';
import { checkDBConnection } from '../config/db.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const validatePerson = (p, role = 'Participant') => {
  if (!p) throw new Error(`${role} information is required.`);
  if (!p.name?.trim()) throw new Error(`${role} name is required.`);
  if (!p.email?.trim() || !EMAIL_REGEX.test(p.email.trim())) {
    throw new Error(`Valid email required for ${role.toLowerCase()}.`);
  }
  const cleanPhone = p.phone?.trim()?.replace(/\D/g, '');
  if (!cleanPhone || !PHONE_REGEX.test(cleanPhone)) {
    throw new Error(`Valid 10-digit Indian mobile number required for ${role.toLowerCase()}.`);
  }
  if (!p.college?.trim()) throw new Error(`${role} college name is required.`);
  if (!p.branch?.trim()) throw new Error(`${role} branch is required.`);
  if (!p.year?.trim()) throw new Error(`${role} year of study is required.`);
};

/**
 * POST /api/registrations
 * Create individual or team registration
 */
export const createRegistration = async (req, res, next) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected. Please check server configuration.',
      });
    }

    const { eventId, registrationType, participant, teamName, teamLeader, members, termsAccepted } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Event ID is required.' });
    }

    if (!termsAccepted) {
      return res.status(400).json({ success: false, message: 'You must accept the terms and guidelines.' });
    }

    // Find Event definition (DB or fallback seed)
    const lowerEventId = eventId.toLowerCase();
    let event = await Event.findOne({
      $or: [{ slug: lowerEventId }, { slug: `event-${lowerEventId}` }],
    }).lean();

    if (!event) {
      event = initialEvents.find(
        (e) => e.slug === lowerEventId || e.slug === `event-${lowerEventId}`
      );
    }

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const isTeam = event.registrationType === 'team' || registrationType === 'team';

    if (isTeam) {
      // Validate Team
      if (!teamName?.trim()) {
        return res.status(400).json({ success: false, message: 'Team Name is required.' });
      }

      validatePerson(teamLeader, 'Team Leader');

      const teamMembers = Array.isArray(members) ? members : [];
      const totalSize = teamMembers.length + 1;
      const minSize = event.minTeamSize || 2;
      const maxSize = event.maxTeamSize || 4;

      if (totalSize < minSize || totalSize > maxSize) {
        return res.status(400).json({
          success: false,
          message: `Team size for ${event.name} must be between ${minSize} and ${maxSize} members (received: ${totalSize}).`,
        });
      }

      teamMembers.forEach((m, idx) => validatePerson(m, `Team Member ${idx + 2}`));

      // Check unique emails in team
      const allEmails = [
        teamLeader.email.trim().toLowerCase(),
        ...teamMembers.map((m) => m.email.trim().toLowerCase()),
      ];
      if (new Set(allEmails).size !== allEmails.length) {
        return res.status(400).json({
          success: false,
          message: 'All team members must have unique email addresses.',
        });
      }

      // Check duplicate in DB for this competition
      const existing = await Registration.findOne({
        eventId: event.slug,
        $or: [{ 'teamLeader.email': { $in: allEmails } }, { 'members.email': { $in: allEmails } }],
      }).lean();

      if (existing) {
        return res.status(409).json({
          success: false,
          message: `A team member is already registered for ${event.name} under team "${existing.teamName}".`,
        });
      }

      const registrationId = await generateRegistrationId(event.code || 'HACK');

      const newRegistration = await Registration.create({
        registrationId,
        eventId: event.slug,
        eventName: event.name,
        registrationType: 'team',
        teamName: teamName.trim(),
        teamLeader: {
          name: teamLeader.name.trim(),
          email: teamLeader.email.trim().toLowerCase(),
          phone: teamLeader.phone.trim().replace(/\D/g, ''),
          college: teamLeader.college.trim(),
          branch: teamLeader.branch.trim(),
          year: teamLeader.year.trim(),
        },
        members: teamMembers.map((m) => ({
          name: m.name.trim(),
          email: m.email.trim().toLowerCase(),
          phone: m.phone.trim().replace(/\D/g, ''),
          college: m.college.trim(),
          branch: m.branch.trim(),
          year: m.year.trim(),
        })),
        termsAccepted: true,
        registeredAt: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        data: newRegistration,
      });
    } else {
      // Validate Individual
      validatePerson(participant, 'Participant');
      const email = participant.email.trim().toLowerCase();

      const existing = await Registration.findOne({
        eventId: event.slug,
        'participant.email': email,
      }).lean();

      if (existing) {
        return res.status(409).json({
          success: false,
          message: `Email "${email}" is already registered for ${event.name} (ID: ${existing.registrationId}).`,
        });
      }

      const registrationId = await generateRegistrationId(event.code || 'IND');

      const newRegistration = await Registration.create({
        registrationId,
        eventId: event.slug,
        eventName: event.name,
        registrationType: 'individual',
        participant: {
          name: participant.name.trim(),
          email,
          phone: participant.phone.trim().replace(/\D/g, ''),
          college: participant.college.trim(),
          branch: participant.branch.trim(),
          year: participant.year.trim(),
        },
        termsAccepted: true,
        registeredAt: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        data: newRegistration,
      });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * GET /api/registrations
 * Query all registrations (with competition filter & search for admin)
 */
export const getAllRegistrations = async (req, res, next) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ success: false, message: 'Database is not connected.' });
    }

    const { eventId, search, type } = req.query;
    const filter = {};

    if (eventId && eventId !== 'all') {
      // Support matching slug like 'event-1' or raw id '1'
      const cleanEventId = eventId.toLowerCase();
      filter.$or = [{ eventId: cleanEventId }, { eventId: `event-${cleanEventId}` }];
    }

    if (type && type !== 'all') {
      filter.registrationType = type;
    }

    if (search && search.trim()) {
      const term = search.trim();
      const regex = new RegExp(term, 'i');
      const searchConditions = [
        { registrationId: regex },
        { eventName: regex },
        { teamName: regex },
        { 'participant.name': regex },
        { 'participant.email': regex },
        { 'participant.college': regex },
        { 'participant.phone': regex },
        { 'teamLeader.name': regex },
        { 'teamLeader.email': regex },
        { 'teamLeader.college': regex },
        { 'teamLeader.phone': regex },
        { 'members.name': regex },
        { 'members.email': regex },
      ];

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    const registrations = await Registration.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/registrations/stats
 * Aggregated counts per competition for Admin dashboard
 */
export const getRegistrationStats = async (req, res, next) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ success: false, message: 'Database is not connected.' });
    }

    const [total, teamCount, individualCount, eventStats] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ registrationType: 'team' }),
      Registration.countDocuments({ registrationType: 'individual' }),
      Registration.aggregate([
        {
          $group: {
            _id: '$eventId',
            eventName: { $first: '$eventName' },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const perEvent = {};
    eventStats.forEach((st) => {
      perEvent[st._id] = {
        name: st.eventName,
        count: st.count,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        teamCount,
        individualCount,
        perEvent,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/registrations/:registrationId
 */
export const getRegistrationById = async (req, res, next) => {
  try {
    const { registrationId } = req.params;

    if (!checkDBConnection()) {
      return res.status(503).json({ success: false, message: 'Database is not connected.' });
    }

    const reg = await Registration.findOne({
      registrationId: registrationId.toUpperCase().trim(),
    }).lean();

    if (!reg) {
      return res.status(404).json({ success: false, message: `Registration "${registrationId}" not found.` });
    }

    res.status(200).json({ success: true, data: reg });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/registrations/:id
 * Delete registration (Admin action)
 */
export const deleteRegistration = async (req, res, next) => {
  try {
    const { registrationId } = req.params;

    if (!checkDBConnection()) {
      return res.status(503).json({ success: false, message: 'Database is not connected.' });
    }

    const deleted = await Registration.findOneAndDelete({
      $or: [
        { registrationId: registrationId.toUpperCase().trim() },
        { _id: /^[0-9a-fA-F]{24}$/.test(registrationId) ? registrationId : null },
      ],
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    res.status(200).json({
      success: true,
      message: `Registration ${deleted.registrationId} successfully deleted.`,
    });
  } catch (error) {
    next(error);
  }
};
