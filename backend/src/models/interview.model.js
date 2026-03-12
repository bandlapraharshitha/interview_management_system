import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSlot', required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'canceled'], default: 'scheduled' },
  decision: { type: String, enum: ['none', 'accepted', 'rejected'], default: 'none' },
  meetingLink: { type: String }
}, {
  timestamps: true
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
