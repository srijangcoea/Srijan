import { Registration } from '../models/Registration.js';
import { Event } from '../models/Event.js';
import { initialEvents } from '../data/seedData.js';
import { generateRegistrationId } from '../utils/generateRegistrationId.js';
import { checkDBConnection } from '../config/db.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const EVENT_CODE_MAP = {
  'event-1': 'HACK',
  '1': 'HACK',
  'hack': 'HACK',
  'hackathon': 'HACK',
  'event-2': 'KBC',
  '2': 'KBC',
  'kbc': 'KBC',
  'event-3': 'PCB',
  '3': 'PCB',
  'pcb': 'PCB',
  'event-4': 'CAD',
  '4': 'CAD',
  'cad': 'CAD',
  'event-5': 'BRG',
  '5': 'BRG',
  'brg': 'BRG',
  'bridge': 'BRG',
  'event-6': 'CIRCUIT',
  '6': 'CIRCUIT',
  'circuit': 'CIRCUIT',
};

const getEventCodeFromSlug = (slug) => {
  if (!slug) return 'GEN';
  const clean = slug.toLowerCase().trim();
  return EVENT_CODE_MAP[clean] || clean.toUpperCase();
};

const normalizePersonPhone = (phone) => {
  let clean = phone ? String(phone).trim().replace(/\D/g, '') : '';
  if (clean.length === 12 && clean.startsWith('91')) {
    clean = clean.slice(2);
  } else if (clean.length === 11 && clean.startsWith('0')) {
    clean = clean.slice(1);
  }
  return clean;
};

const validatePerson = (p, role = 'Participant') => {
  if (!p) throw new Error(`${role} information is required.`);
  if (!p.name?.trim()) throw new Error(`${role} name is required.`);
  if (!p.email?.trim() || !EMAIL_REGEX.test(p.email.trim())) {
    throw new Error(`Valid email required for ${role.toLowerCase()}.`);
  }
  const cleanPhone = normalizePersonPhone(p.phone);
  if (!cleanPhone || !PHONE_REGEX.test(cleanPhone)) {
    throw new Error(`Valid 10-digit Indian mobile number required for ${role.toLowerCase()}.`);
  }
  p.phone = cleanPhone;
  if (!p.college?.trim()) p.college = 'Government College of Engineering, Amravati';
  if (!p.branch?.trim() && p.department?.trim()) p.branch = p.department;
  if (!p.branch?.trim()) throw new Error(`${role} department is required.`);
  if (!p.year?.trim()) throw new Error(`${role} year of study is required.`);
};

/**
 * Normalizes registration document for client-side consumption
 */
const formatRegistration = (reg) => {
  if (!reg) return reg;
  const lead = reg.registrationType === 'team' ? reg.teamLeader : reg.participant;
  const eventCode = reg.eventCode || getEventCodeFromSlug(reg.eventId);
  return {
    ...reg,
    eventCode,
    leader: reg.leader || lead || {
      name: lead?.name || '',
      email: lead?.email || '',
      phone: lead?.phone || '',
      mobile: lead?.phone || '',
      department: lead?.branch || lead?.department || '',
      branch: lead?.branch || lead?.department || '',
      year: lead?.year || '',
      college: lead?.college || 'Government College of Engineering, Amravati',
    },
    department: reg.department || lead?.branch || lead?.department || '',
    year: reg.year || lead?.year || '',
    phone: reg.phone || lead?.phone || '',
    teamSize: reg.registrationType === 'team' ? (reg.members?.length || 0) + 1 : 1,
  };
};

/**
 * GET /api/registrations/check
 * Check if email is already registered for an event
 */
export const checkRegistrationDuplicate = async (req, res, next) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ success: false, message: 'Database is not connected.' });
    }

    const { eventId, email } = req.query;
    if (!eventId || !email) {
      return res.status(400).json({ success: false, message: 'eventId and email query parameters are required.' });
    }

    const normEmail = email.trim().toLowerCase();
    const cleanEventId = eventId.toLowerCase().trim();

    // Find event
    let event = await Event.findOne({
      $or: [
        { slug: cleanEventId },
        { slug: `event-${cleanEventId}` },
        { code: cleanEventId.toUpperCase() },
      ],
    }).lean();

    if (!event) {
      event = initialEvents.find(
        (e) =>
          e.slug === cleanEventId ||
          e.slug === `event-${cleanEventId}` ||
          (e.code && e.code.toUpperCase() === cleanEventId.toUpperCase())
      );
    }

    const targetSlugs = event
      ? [event.slug, event.slug.replace(/^event-/, ''), (event.code || '').toUpperCase()]
      : [cleanEventId, `event-${cleanEventId}`, cleanEventId.toUpperCase()];

    const existing = await Registration.findOne({
      $or: [
        { eventId: { $in: targetSlugs } },
        { eventCode: (event?.code || cleanEventId).toUpperCase() },
      ],
      $or: [
        { 'participant.email': normEmail },
        { 'teamLeader.email': normEmail },
        { 'members.email': normEmail },
      ],
    }).lean();

    if (existing) {
      return res.status(200).json({
        success: true,
        isDuplicate: true,
        message: `Email "${normEmail}" is already registered for this competition (ID: ${existing.registrationId}).`,
      });
    }

    return res.status(200).json({
      success: true,
      isDuplicate: false,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/registrations
 * Create individual or team registration in MongoDB Atlas
 */
export const createRegistration = async (req, res, next) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected. Please check server configuration.',
      });
    }

    const {
      eventId,
      registrationType,
      participant,
      teamName,
      teamLeader,
      members,
      termsAccepted = true,
    } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Event ID is required.' });
    }

    // Find Event definition (DB or fallback seed)
    const cleanEventId = String(eventId).trim().toLowerCase();
    let event = await Event.findOne({
      $or: [
        { slug: cleanEventId },
        { slug: `event-${cleanEventId}` },
        { code: cleanEventId.toUpperCase() },
      ],
    }).lean();

    if (!event) {
      event = initialEvents.find(
        (e) =>
          e.slug === cleanEventId ||
          e.slug === `event-${cleanEventId}` ||
          (e.code && e.code.toUpperCase() === cleanEventId.toUpperCase())
      );
    }

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const isTeam = event.registrationType === 'team' || registrationType === 'team';
    const eventCode = (event.code || getEventCodeFromSlug(event.slug)).toUpperCase();
    const eventMatchQuery = {
      $or: [
        { eventId: event.slug },
        { eventId: event.slug.replace(/^event-/, '') },
        { eventCode },
      ],
    };

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

      // Check unique phones in team
      const allPhones = [
        teamLeader.phone,
        ...teamMembers.map((m) => m.phone),
      ];
      if (new Set(allPhones).size !== allPhones.length) {
        return res.status(400).json({
          success: false,
          message: 'All team members must have unique mobile numbers.',
        });
      }

      // Check duplicate in DB for this competition
      const existing = await Registration.findOne({
        ...eventMatchQuery,
        $or: [
          { 'teamLeader.email': { $in: allEmails } },
          { 'members.email': { $in: allEmails } },
          { 'participant.email': { $in: allEmails } },
        ],
      }).lean();

      if (existing) {
        return res.status(409).json({
          success: false,
          message: `A participant is already registered for ${event.name} (Registration ID: ${existing.registrationId}).`,
        });
      }

      const registrationId = await generateRegistrationId(eventCode);

      const newRegistration = await Registration.create({
        registrationId,
        eventId: event.slug,
        eventCode,
        eventName: event.name,
        registrationType: 'team',
        teamName: teamName.trim(),
        teamLeader: {
          name: teamLeader.name.trim(),
          email: teamLeader.email.trim().toLowerCase(),
          phone: teamLeader.phone,
          college: teamLeader.college.trim(),
          branch: teamLeader.branch.trim(),
          year: teamLeader.year.trim(),
        },
        members: teamMembers.map((m) => ({
          name: m.name.trim(),
          email: m.email.trim().toLowerCase(),
          phone: m.phone,
          college: m.college.trim(),
          branch: m.branch.trim(),
          year: m.year.trim(),
        })),
        termsAccepted: Boolean(termsAccepted),
        registeredAt: new Date(),
        status: 'confirmed',
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        data: formatRegistration(newRegistration.toObject()),
      });
    } else {
      // Validate Individual
      const personData = participant || teamLeader;
      validatePerson(personData, 'Participant');
      const email = personData.email.trim().toLowerCase();

      const existing = await Registration.findOne({
        ...eventMatchQuery,
        $or: [
          { 'participant.email': email },
          { 'teamLeader.email': email },
          { 'members.email': email },
        ],
      }).lean();

      if (existing) {
        return res.status(409).json({
          success: false,
          message: `Email "${email}" is already registered for ${event.name} (Registration ID: ${existing.registrationId}).`,
        });
      }

      const registrationId = await generateRegistrationId(eventCode);

      const newRegistration = await Registration.create({
        registrationId,
        eventId: event.slug,
        eventCode,
        eventName: event.name,
        registrationType: 'individual',
        participant: {
          name: personData.name.trim(),
          email,
          phone: personData.phone,
          college: personData.college.trim(),
          branch: personData.branch.trim(),
          year: personData.year.trim(),
        },
        termsAccepted: Boolean(termsAccepted),
        registeredAt: new Date(),
        status: 'confirmed',
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        data: formatRegistration(newRegistration.toObject()),
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
      const cleanEventId = eventId.toLowerCase().trim();
      const code = cleanEventId.toUpperCase();
      filter.$or = [
        { eventId: cleanEventId },
        { eventId: `event-${cleanEventId}` },
        { eventCode: code },
      ];
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
        { eventCode: regex },
        { teamName: regex },
        { 'participant.name': regex },
        { 'participant.email': regex },
        { 'participant.college': regex },
        { 'participant.phone': regex },
        { 'participant.branch': regex },
        { 'teamLeader.name': regex },
        { 'teamLeader.email': regex },
        { 'teamLeader.college': regex },
        { 'teamLeader.phone': regex },
        { 'teamLeader.branch': regex },
        { 'members.name': regex },
        { 'members.email': regex },
        { 'members.phone': regex },
      ];

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    const rawRegistrations = await Registration.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const formatted = rawRegistrations.map(formatRegistration);

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
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
            eventCode: { $first: '$eventCode' },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const perEvent = {};
    eventStats.forEach((st) => {
      const code = st.eventCode || getEventCodeFromSlug(st._id);
      perEvent[st._id] = {
        name: st.eventName,
        code,
        count: st.count,
      };
      if (code) {
        perEvent[code] = {
          name: st.eventName,
          code,
          count: st.count,
        };
      }
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

    res.status(200).json({ success: true, data: formatRegistration(reg) });
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