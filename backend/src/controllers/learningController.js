import LearningResource from '../models/LearningResource.js';
import Opportunity from '../models/Opportunity.js';
import User from '../models/User.js';
import { groupLearningByRoadmap } from '../services/learningService.js';
import { successResponse, errorResponse } from '../utils/response.js';

// @desc    Get actionable learning recommendations
// @route   GET /api/learning-recommendations
export const getLearningRecommendations = async (req, res, next) => {
  try {
    const { skillId, opportunityId } = req.query;

    let targetSkillIds = [];

    if (skillId) {
      targetSkillIds = [skillId];
    } else if (opportunityId) {
      const opp = await Opportunity.findById(opportunityId);
      if (opp && req.user) {
        const user = await User.findById(req.user._id);
        const userSkillIds = (user.skills || []).map((s) => s.toString());
        targetSkillIds = (opp.requiredSkills || []).filter(
          (rs) => !userSkillIds.includes(rs.toString())
        );
      }
    }

    let filter = { isActive: true };
    if (targetSkillIds.length > 0) {
      filter.skill = { $in: targetSkillIds };
    }

    let resources = await LearningResource.find(filter).populate('skill');

    if (resources.length === 0) {
      // Fallback to active catalog
      resources = await LearningResource.find({ isActive: true }).populate('skill');
    }

    const roadmap = groupLearningByRoadmap(resources);

    return successResponse(res, {
      count: resources.length,
      resources,
      roadmap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all learning resources
// @route   GET /api/learning-resources
export const getAllLearningResources = async (req, res, next) => {
  try {
    const resources = await LearningResource.find({ isActive: true }).populate('skill');
    return successResponse(res, { count: resources.length, resources });
  } catch (error) {
    next(error);
  }
};
