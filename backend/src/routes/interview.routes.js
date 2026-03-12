import express from 'express';
import { scheduleInterview, getInterviews, updateInterviewDecision } from '../controllers/interview.controller.js';
import { protect, interviewer } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getInterviews);

router.route('/schedule')
  .post(protect, scheduleInterview);

router.route('/:id/decision')
  .patch(protect, interviewer, updateInterviewDecision);

export default router;
