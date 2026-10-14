import mongoose from 'mongoose';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import { successResponse, errorResponse } from '../utils/response.js';

const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Resolve an array of skill IDs, skill names, or skill objects into valid Skill ObjectIds (creating in DB if not existing)
export const resolveSkillsToIds = async (skillsInput) => {
  if (!Array.isArray(skillsInput)) return [];
  const resolvedIds = [];

  for (const item of skillsInput) {
    if (!item) continue;

    // Case 1: Already a valid Mongo ObjectId string (and not a temp_ id)
    if (typeof item === 'string' && mongoose.Types.ObjectId.isValid(item) && item.length === 24) {
      resolvedIds.push(item);
      continue;
    }

    // Case 2: Object with a valid 24-char Mongo _id
    if (
      typeof item === 'object' &&
      item._id &&
      typeof item._id === 'string' &&
      mongoose.Types.ObjectId.isValid(item._id) &&
      item._id.length === 24
    ) {
      resolvedIds.push(item._id);
      continue;
    }

    // Case 3: Skill name string or object with .name -> find in DB or create if not exist
    const rawName = typeof item === 'string' ? item.trim() : (item.name || '').trim();
    if (!rawName || rawName.startsWith('temp_')) continue;

    let skillDoc = await Skill.findOne({
      name: new RegExp(`^${escapeRegex(rawName)}$`, 'i'),
    });

    if (!skillDoc) {
      skillDoc = await Skill.create({
        name: rawName,
        category: (typeof item === 'object' && item.category) || 'General',
        description: `Verified skill: ${rawName}`,
      });
    }

    resolvedIds.push(skillDoc._id);
  }

  // Deduplicate ObjectIds
  return [...new Set(resolvedIds.map((id) => id.toString()))];
};

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
      'interests',
      'experience',
      'location',
      'companyDetails',
      'savedOpportunities',
      'completedLearningResources',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.body.skills !== undefined) {
      user.skills = await resolveSkillsToIds(req.body.skills);
    }

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

// @desc    Toggle saved/bookmarked opportunity in database
// @route   POST /api/users/me/saved-opportunities/:opportunityId
export const toggleSavedOpportunity = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }

    const currentSaved = (user.savedOpportunities || []).map((id) => id.toString());
    const exists = currentSaved.includes(opportunityId);

    if (exists) {
      user.savedOpportunities = user.savedOpportunities.filter(
        (id) => id.toString() !== opportunityId
      );
    } else if (mongoose.Types.ObjectId.isValid(opportunityId)) {
      user.savedOpportunities.push(opportunityId);
    }

    await user.save();
    const savedIds = user.savedOpportunities.map((id) => id.toString());

    return successResponse(
      res,
      { savedOpportunities: savedIds, isSaved: !exists },
      exists ? 'Opportunity removed from saved list.' : 'Opportunity saved to your profile.'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle completed learning resource in database
// @route   POST /api/users/me/completed-learning/:resourceId
export const toggleCompletedLearning = async (req, res, next) => {
  try {
    const { resourceId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }

    const currentCompleted = (user.completedLearningResources || []).map((id) => id.toString());
    const exists = currentCompleted.includes(resourceId);

    if (exists) {
      user.completedLearningResources = user.completedLearningResources.filter(
        (id) => id.toString() !== resourceId
      );
    } else if (mongoose.Types.ObjectId.isValid(resourceId)) {
      user.completedLearningResources.push(resourceId);
    }

    await user.save();
    const completedIds = user.completedLearningResources.map((id) => id.toString());

    return successResponse(
      res,
      { completedLearningResources: completedIds, isCompleted: !exists },
      exists ? 'Marked resource as incomplete.' : 'Marked learning resource as completed!'
    );
  } catch (error) {
    next(error);
  }
};
