import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === 'local';
      },
      select: false, // never returned by default in normal responses
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['student', 'employer'],
      default: 'student',
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    education: {
      degree: { type: String, default: '' },
      institution: { type: String, default: '' },
      fieldOfStudy: { type: String, default: '' },
      startYear: { type: String, default: '' },
      endYear: { type: String, default: '' },
      grade: { type: String, default: '' },
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    interests: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: {
      role: { type: String, default: '' },
      organization: { type: String, default: '' },
      duration: { type: String, default: '' },
      description: { type: String, default: '' },
    },
    location: {
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      remotePreference: {
        type: String,
        enum: ['Remote', 'Hybrid', 'On-site', 'Any'],
        default: 'Any',
      },
    },
    companyDetails: {
      companyName: { type: String, default: '' },
      logo: { type: String, default: '' },
      industry: { type: String, default: '' },
      description: { type: String, default: '' },
      website: { type: String, default: '' },
      hiringTypes: [{ type: String }],
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

// Password hashing pre-save hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password verification method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
