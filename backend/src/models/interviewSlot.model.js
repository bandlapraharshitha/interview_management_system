import mongoose from 'mongoose';

const interviewSlotSchema = new mongoose.Schema({
  interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD for easy querying
  startTime: { type: String, required: true }, // Format: "10:00"
  endTime: { type: String, required: true },   // Format: "10:30"
  isBooked: { type: Boolean, default: false }
});

const InterviewSlot = mongoose.model('InterviewSlot', interviewSlotSchema);

export default InterviewSlot;
