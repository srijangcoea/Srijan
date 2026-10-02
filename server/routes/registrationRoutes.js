import express from 'express';
import {
  createRegistration,
  getRegistrationById,
  getAllRegistrations,
  getRegistrationStats,
  deleteRegistration,
} from '../controllers/registrationController.js';
import { registrationRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public registration creation with rate limiter
router.post('/', registrationRateLimiter, createRegistration);

// Admin stats summary
router.get('/stats', getRegistrationStats);

// List all registrations (with filters: eventId, search, type)
router.get('/', getAllRegistrations);

// Retrieve single registration by ID
router.get('/:registrationId', getRegistrationById);

// Delete registration (admin)
router.delete('/:registrationId', deleteRegistration);

export default router;
