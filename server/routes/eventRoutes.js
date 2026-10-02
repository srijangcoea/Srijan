import express from 'express';
import { getEvents, getEventById, updateEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.put('/:id', protect, updateEvent);
router.patch('/:id', protect, updateEvent);

export default router;
