import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    organizationLogo: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['Internship', 'Apprenticeship', 'Entry-level Job', 'Full-time', 'Part-time', 'Contract'],
      default: 'Internship',
      required: true,
    },
    requiredSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    qualification: {
      degree: { type: String, default: '' },
      field: { type: String, default: '' },
      minCgpa: { type: Number, default: 0 },
    },
    experienceRequired: {
      minYears: { type: Number, default: 0 },
      level: { type: String, default: 'Fresher / Entry' },
    },
    location: {
      type: {
        type: String,
        enum: ['Remote', 'Hybrid', 'On-site'],
        default: 'Remote',
      },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: 'India' },
    },
    interests: [
      {
        type: String,
        trim: true,
      },
    ],
    salary: {
      amount: { type: String, default: 'Competitive' },
      period: { type: String, default: 'month' }, // month, year, lump sum
      currency: { type: String, default: '₹' },
      isUnpaid: { type: Boolean, default: false },
    },
    applicationUrl: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Draft'],
      default: 'Active',
    },
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

opportunitySchema.index({ createdBy: 1 });
opportunitySchema.index({ status: 1 });
opportunitySchema.index({ deadline: 1 });
opportunitySchema.index({ requiredSkills: 1 });
opportunitySchema.index({ title: 'text', description: 'text', organization: 'text' });

const Opportunity = mongoose.models.Opportunity || mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;
