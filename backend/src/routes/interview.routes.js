import express from 'express';
import { scheduleInterview, getInterviews, updateInterviewDecision, updateMeetingLink } from '../controllers/interview.controller.js';
import { protect, interviewer } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getInterviews);

router.route('/schedule')
  .post(protect, scheduleInterview);

router.route('/:id/decision')
  .patch(protect, interviewer, updateInterviewDecision);

router.route('/:id/link')
  .patch(protect, interviewer, updateMeetingLink);

export default router;
