import express from 'express';
import { getAvailableSlots, getMySlots, createAvailability, deleteSlot } from '../controllers/availability.controller.js';
import { protect, interviewer } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getAvailableSlots)
  .post(protect, interviewer, createAvailability);

router.route('/me')
  .get(protect, interviewer, getMySlots);

router.route('/:id')
  .delete(protect, interviewer, deleteSlot);

export default router;
