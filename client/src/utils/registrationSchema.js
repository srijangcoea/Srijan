import { z } from 'zod';

/**
 * SRIJAN 2026 - COMMON REGISTRATION VALIDATION SCHEMA (ZOD)
 * 
 * Rules:
 * - All fields are required.
 * - Mobile must be exactly 10 digits (Indian mobile prefix 6-9).
 * - Email format check (lowercase).
 * - All emails across leader and all members must be distinct.
 * - Dynamic generation based on minTeamSize, maxTeamSize, and current teamSize.
 */

const phoneRegex = /^[6-9]\d{9}$/;

// Base participant dossier schema
export const participantDossierSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(80, { message: 'Name cannot exceed 80 characters.' })
    .trim(),
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Please enter a valid email address.' })
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(1, { message: 'Mobile number is required.' })
    .regex(phoneRegex, { message: 'Must be a valid 10-digit mobile number (starts with 6-9).' })
    .trim(),
  department: z
    .string()
    .min(1, { message: 'Academic department is required.' })
    .trim(),
  year: z
    .enum(['FY', 'SY', 'TY', 'Final Y'], {
      errorMap: () => ({ message: 'Please select academic year standing.' }),
    }),
});

/**
 * Builds the complete registration schema dynamically based on event config
 */
export function buildRegistrationSchema(eventConfig, currentTeamSize = 1) {
  const isTeamEvent = (eventConfig?.maxTeamSize || 1) > 1;

  let baseSchema = z.object({
    eventId: z.string().min(1, 'Event ID is required.'),
    eventCode: z.string().min(1, 'Event code is required.'),
    leader: participantDossierSchema,
  });

  if (isTeamEvent) {
    const minSlots = eventConfig.minTeamSize || 2;
    const maxSlots = eventConfig.maxTeamSize || 4;

    baseSchema = baseSchema.extend({
      teamName: z
        .string()
        .min(2, { message: 'Team callsign / squad name must be at least 2 characters.' })
        .max(50, { message: 'Team callsign cannot exceed 50 characters.' })
        .trim(),
      teamSize: z
        .number()
        .min(minSlots, `Minimum team size is ${minSlots} operators.`)
        .max(maxSlots, `Maximum team size is ${maxSlots} operators.`),
      members: z.array(participantDossierSchema).length(
        Math.max(0, currentTeamSize - 1),
        `Exactly ${currentTeamSize - 1} complementary operator(s) required.`
      ),
    });
  }

  // Refine for email and phone uniqueness within the team
  return baseSchema.superRefine((data, ctx) => {
    if (isTeamEvent && data.members && data.members.length > 0) {
      const allEmails = [data.leader.email, ...data.members.map((m) => m.email)].filter(Boolean);
      const emailSet = new Set(allEmails);
      if (emailSet.size !== allEmails.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'All operator email addresses within the team must be unique.',
          path: ['members'],
        });
      }

      const allPhones = [data.leader.phone, ...data.members.map((m) => m.phone)].filter(Boolean);
      const phoneSet = new Set(allPhones);
      if (phoneSet.size !== allPhones.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'All operator mobile numbers within the team must be unique.',
          path: ['members'],
        });
      }
    }
  });
}
