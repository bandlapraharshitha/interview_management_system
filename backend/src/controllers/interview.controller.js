import Interview from '../models/interview.model.js';
import InterviewSlot from '../models/interviewSlot.model.js';
import User from '../models/user.model.js';

// @desc    Schedule an interview
// @route   POST /api/interviews/schedule
// @access  Private (User)
export const scheduleInterview = async (req, res) => {
  try {
    const { date, time } = req.body;

    // Find the first available slot at this date and time
    const slot = await InterviewSlot.findOne({ date, startTime: time, isBooked: false });

    if (!slot) {
      return res.status(400).json({ message: 'No available slots for this time.' });
    }

    // Mark slot as booked
    slot.isBooked = true;
    await slot.save();

    // Create Interview
    const interview = await Interview.create({
      userId: req.user._id,
      interviewerId: slot.interviewerId,
      slotId: slot._id,
      status: 'scheduled',
      decision: 'none'
    });

    res.status(201).json({ message: 'Interview scheduled successfully', interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get interviews based on role
// @route   GET /api/interviews
// @access  Private
export const getInterviews = async (req, res) => {
  try {
    let interviews;
    if (req.user.role === 'admin') {
      interviews = await Interview.find()
        .populate('userId', 'name email city age gender')
        .populate('interviewerId', 'name')
        .populate('slotId', 'date startTime endTime')
        .sort('-createdAt');
    } else if (req.user.role === 'interviewer') {
      interviews = await Interview.find({ interviewerId: req.user._id })
        .populate('userId', 'name email city age gender')
        .populate('slotId', 'date startTime endTime')
        .sort('-createdAt');
    } else {
      interviews = await Interview.find({ userId: req.user._id })
        .populate('interviewerId', 'name')
        .populate('slotId', 'date startTime endTime')
        .sort('-createdAt');
    }
    
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update interview decision
// @route   PATCH /api/interviews/:id/decision
// @access  Private (Interviewer)
export const updateInterviewDecision = async (req, res) => {
  try {
    const { decision } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(decision)) {
      return res.status(400).json({ message: 'Invalid decision type' });
    }

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Ensure this interviewer owns the interview
    if (interview.interviewerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
       return res.status(401).json({ message: 'Not authorized' });
    }

    interview.decision = decision;
    interview.status = 'completed';
    await interview.save();

    // Update the User's overall status
    const user = await User.findById(interview.userId);
    if (user) {
      user.status = decision;
      await user.save();
    }

    res.json({ message: `Interview decision set to ${decision}`, interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update interview meeting link
// @route   PATCH /api/interviews/:id/link
// @access  Private (Interviewer)
export const updateMeetingLink = async (req, res) => {
  try {
    const { meetingLink } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.interviewerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
       return res.status(401).json({ message: 'Not authorized' });
    }

    interview.meetingLink = meetingLink;
    await interview.save();

    res.json({ message: 'Meeting link updated successfully', interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
