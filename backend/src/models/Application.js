import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Rejected', 'Selected'],
      default: 'Applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
    timeline: [
      {
        stage: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          default: '',
        },
      },
    ],
    interviewDetails: {
      date: { type: Date },
      time: { type: String, default: '' },
      type: { type: String, enum: ['Virtual Video Call', 'Technical Round', 'In-Person', 'HR Discussion'], default: 'Virtual Video Call' },
      location: { type: String, default: '' },
      link: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

// Unique compound constraint prevents duplicate applications
applicationSchema.index({ user: 1, opportunity: 1 }, { unique: true });
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ opportunity: 1, status: 1 });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export default Application;
