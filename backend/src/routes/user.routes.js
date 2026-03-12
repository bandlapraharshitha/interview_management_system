import express from 'express';
import { getUsers, getUserById } from '../controllers/user.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/:id').get(protect, getUserById);

export default router;
