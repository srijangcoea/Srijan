import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    eventId: {
      type: String,
      required: true,
      trim: true,
    },
    eventName: {
      type: String,
      trim: true,
    },
    participantName: {
      type: String,
      trim: true,
    },
    present: {
      type: Boolean,
      default: false,
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ registrationId: 1 }, { unique: true });
attendanceSchema.index({ eventId: 1 });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
