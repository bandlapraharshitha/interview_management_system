import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

// @desc    Get all interviewers
// @route   GET /api/interviewers
// @access  Private/Admin
export const getInterviewers = async (req, res) => {
  try {
    const interviewers = await User.find({ role: 'interviewer' }).select('-password');
    res.json(interviewers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add an interviewer
// @route   POST /api/interviewers
// @access  Private/Admin
export const addInterviewer = async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Interviewer with this email already exists' });
    }

    const interviewer = await User.create({
      name,
      email,
      password: password,
      age,
      gender,
      role: 'interviewer'
    });

    if (interviewer) {
      res.status(201).json({
        message: 'Interviewer created successfully',
        interviewer: {
          _id: interviewer._id,
          name: interviewer.name,
          email: interviewer.email,
          role: interviewer.role
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid interviewer data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an interviewer
// @route   DELETE /api/interviewers/:id
// @access  Private/Admin
export const deleteInterviewer = async (req, res) => {
  try {
    const interviewer = await User.findById(req.params.id);

    if (interviewer && interviewer.role === 'interviewer') {
      await interviewer.deleteOne();
      res.json({ message: 'Interviewer removed' });
    } else {
      res.status(404).json({ message: 'Interviewer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
