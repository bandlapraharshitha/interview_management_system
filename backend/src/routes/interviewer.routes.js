import express from 'express';
import { getInterviewers, addInterviewer, deleteInterviewer } from '../controllers/interviewer.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getInterviewers)
  .post(protect, admin, addInterviewer);

router.route('/:id')
  .delete(protect, admin, deleteInterviewer);

export default router;
