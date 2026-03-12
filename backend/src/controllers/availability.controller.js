import InterviewSlot from '../models/interviewSlot.model.js';

// Helper function to generate 30-min slots
const generateTimeSlots = (date, startTime, endTime) => {
  const slots = [];
  let current = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);

  while (current < end) {
    const next = new Date(current.getTime() + 30 * 60000); // add 30 mins
    if (next <= end) {
      slots.push({
        date,
        startTime: current.toTimeString().substring(0, 5),
        endTime: next.toTimeString().substring(0, 5),
      });
    }
    current = next;
  }
  return slots;
};

// @desc    Get all available slots for a date (for Users)
// @route   GET /api/availability
// @access  Public or Private (Users)
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) {
      return res.status(400).json({ message: 'Date query parameter is required' });
    }

    const slots = await InterviewSlot.find({ date, isBooked: false })
      .populate('interviewerId', 'name')
      .sort({ startTime: 1 });

    // Grouping slots by startTime for the frontend "2 slots left" view
    const groupedSlots = slots.reduce((acc, slot) => {
      const time = slot.startTime;
      if (!acc[time]) {
        acc[time] = { time, availableSlots: 0, slotIds: [] };
      }
      acc[time].availableSlots += 1;
      acc[time].slotIds.push(slot._id);
      return acc;
    }, {});

    res.json(Object.values(groupedSlots));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in interviewer's created slots
// @route   GET /api/availability/me
// @access  Private/Interviewer
export const getMySlots = async (req, res) => {
  try {
    const slots = await InterviewSlot.find({ interviewerId: req.user._id }).sort({ date: 1, startTime: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new availability slots
// @route   POST /api/availability
// @access  Private/Interviewer
export const createAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    
    // Split into 30 min slots
    const timeBlocks = generateTimeSlots(date, startTime, endTime);

    const createdSlots = [];
    for (const block of timeBlocks) {
      // Check if slot already exists for this interviewer at this time
      const exists = await InterviewSlot.findOne({
        interviewerId: req.user._id,
        date: block.date,
        startTime: block.startTime
      });

      if (!exists) {
        const newSlot = await InterviewSlot.create({
          interviewerId: req.user._id,
          date: block.date,
          startTime: block.startTime,
          endTime: block.endTime
        });
        createdSlots.push(newSlot);
      }
    }

    res.status(201).json({ message: `${createdSlots.length} slots created successfully`, createdSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a slot
// @route   DELETE /api/availability/:id
// @access  Private/Interviewer
export const deleteSlot = async (req, res) => {
  try {
    const slot = await InterviewSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.interviewerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: 'Cannot delete a booked slot' });
    }

    await slot.deleteOne();
    res.json({ message: 'Slot removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
