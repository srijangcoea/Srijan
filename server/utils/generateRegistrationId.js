import { Registration } from '../models/Registration.js';

/**
 * Generate sequential, collision-safe registration ID
 * Format: SRJ-{CODE}-{0001} (e.g. SRJ-HACK-0001, SRJ-PCB-0001)
 */
export const generateRegistrationId = async (eventCode = 'GEN') => {
  const cleanCode = eventCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const prefix = `SRJ-${cleanCode}-`;

  const count = await Registration.countDocuments({
    registrationId: new RegExp(`^${prefix}`),
  });

  let seq = count + 1;
  let candidateId = `${prefix}${String(seq).padStart(4, '0')}`;

  while (await Registration.exists({ registrationId: candidateId })) {
    seq++;
    candidateId = `${prefix}${String(seq).padStart(4, '0')}`;
  }

  return candidateId;
};
