import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Helper to calculate profile completion percentage & list missing fields
export const calculateProfileCompletion = (user) => {
  let score = 0;
  const missing = [];

  // Basic info (20%)
  if (user.name && user.email) score += 20;

  // Education (20%)
  if (user.education?.degree && user.education?.institution) {
    score += 20;
  } else {
    missing.push('Education details (Degree & University)');
  }

  // Skills (25%)
  if (user.skills && user.skills.length >= 3) {
    score += 25;
  } else if (user.skills && user.skills.length > 0) {
    score += 15;
    missing.push('Add at least 3 skills for better matching');
  } else {
    missing.push('Skills list');
  }

  // Experience / Projects (15%)
  if (user.experience?.role || user.experience?.description) {
    score += 15;
  } else {
    missing.push('Experience or Project background');
  }

  // Location / Preferences (10%)
  if (user.location?.city || user.location?.remotePreference) {
    score += 10;
  } else {
    missing.push('Location & Work mode preference');
  }

  // Bio / Resume (10%)
  if (user.bio || user.resumeUrl) {
    score += 10;
  } else {
    missing.push('Brief Bio or Resume');
  }

  return {
    completionPercentage: Math.min(100, score),
    missingFields: missing,
    isComplete: score >= 80,
  };
};

// @desc    Get current user profile
// @route   GET /api/users/me
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('skills');
    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }

    const { completionPercentage, missingFields, isComplete } = calculateProfileCompletion(user);

    return successResponse(res, {
      user,
      profileCompletion: {
        percentage: completionPercentage,
        missingFields,
        isComplete,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/me
export const updateCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }

    const fieldsToUpdate = [
      'name',
      'bio',
      'avatar',
      'resumeUrl',
      'education',
      'skills',
      'interests',
      'experience',
      'location',
      'companyDetails',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    const completion = calculateProfileCompletion(user);
    user.profileCompleted = completion.isComplete;

    await user.save();
    const updated = await User.findById(user._id).populate('skills');

    return successResponse(
      res,
      {
        user: updated,
        profileCompletion: {
          percentage: completion.completionPercentage,
          missingFields: completion.missingFields,
          isComplete: completion.isComplete,
        },
      },
      'Profile updated successfully.'
    );
  } catch (error) {
    next(error);
  }
};
