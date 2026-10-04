import mongoose from 'mongoose';

const platformContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'openpath_main',
    },
    heroAnnouncement: {
      text: { type: String, default: 'Next-Gen 3D Career Intelligence • Live Database Connected' },
      badge: { type: String, default: 'SCROLLTIDE 3D ENGINE' },
    },
    heroScenes: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        subtitle: { type: String, default: '' },
        tag: { type: String, default: '' },
        accent: { type: String, default: '#A855F7' },
      },
    ],
    heroOrbitBadges: [
      {
        id: { type: String },
        label: { type: String, required: true },
        position: { type: String, default: 'top-left' },
        pulse: { type: Boolean, default: false },
      },
    ],
    trendingSearches: [{ type: String }],
    howItWorksSteps: [
      {
        step: { type: String, required: true },
        title: { type: String, required: true },
        desc: { type: String, required: true },
      },
    ],
    features: [
      {
        iconName: { type: String, required: true },
        title: { type: String, required: true },
        desc: { type: String, required: true },
        color: { type: String, default: '#A855F7' },
      },
    ],
    roleHighlights: {
      student: {
        badge: { type: String, default: 'FOR STUDENTS & FRESHERS' },
        title: { type: String, default: 'Discover Roles That Fit Your True Potential' },
        bullets: [{ type: String }],
        ctaText: { type: String, default: 'Create Student Profile' },
      },
      employer: {
        badge: { type: String, default: 'FOR EMPLOYERS & STARTUPS' },
        title: { type: String, default: 'Find Early-Career Talent With Proven Skills' },
        bullets: [{ type: String }],
        ctaText: { type: String, default: 'Employer Portal' },
      },
    },
    skillGapPreview: {
      title: { type: String, default: 'Skill Gap Guidance' },
      question: { type: String, default: 'Missing Docker for Full-Stack role?' },
      chipLabel: { type: String, default: 'Docker Hands-on (3.5h)' },
      targetSkill: { type: String, default: 'Docker' },
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const PlatformContent = mongoose.model('PlatformContent', platformContentSchema);
export default PlatformContent;
