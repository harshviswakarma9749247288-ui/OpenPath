import mongoose from 'mongoose';

const learningResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    type: {
      type: String,
      enum: ['Course', 'Article', 'Video', 'Documentation'],
      default: 'Course',
    },
    url: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      default: 'OpenPath Learning',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    estimatedDuration: {
      type: String,
      default: '2 hours',
    },
    roadmapStage: {
      type: String,
      enum: ['Skill Gap', 'Beginner', 'Practice', 'Project', 'Ready'],
      default: 'Beginner',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

learningResourceSchema.index({ skill: 1, isActive: 1 });

const LearningResource = mongoose.models.LearningResource || mongoose.model('LearningResource', learningResourceSchema);
export default LearningResource;
