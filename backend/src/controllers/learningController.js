import LearningResource from '../models/LearningResource.js';
import Opportunity from '../models/Opportunity.js';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import { groupLearningByRoadmap } from '../services/learningService.js';
import { successResponse } from '../utils/response.js';

const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get actionable learning recommendations
// @route   GET /api/learning-recommendations
export const getLearningRecommendations = async (req, res, next) => {
  try {
    const { skillId, skillName, opportunityId } = req.query;

    let targetSkillIds = [];

    if (skillId) {
      targetSkillIds = [skillId];
    } else if (skillName && skillName.trim()) {
      const cleanName = skillName.trim();
      let skillDoc = await Skill.findOne({
        name: new RegExp(`^${escapeRegex(cleanName)}$`, 'i'),
      });
      if (!skillDoc) {
        skillDoc = await Skill.create({
          name: cleanName,
          category: 'General',
          description: `Verified skill: ${cleanName}`,
        });
      }
      targetSkillIds = [skillDoc._id];

      // Ensure at least one learning resource exists in DB for this skill
      const existingCount = await LearningResource.countDocuments({ skill: skillDoc._id });
      if (existingCount === 0) {
        await LearningResource.create({
          title: `${skillDoc.name} Fundamentals & Practical Guide`,
          description: `Comprehensive hands-on learning path and documentation for mastering ${skillDoc.name} in production projects.`,
          skill: skillDoc._id,
          type: 'Course',
          url: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(skillDoc.name)}`,
          provider: 'OpenPath Academy',
          difficulty: 'Beginner',
          estimatedDuration: '3 hours',
          roadmapStage: 'Beginner',
        });
      }
    } else if (opportunityId) {
      const opp = await Opportunity.findById(opportunityId);
      if (opp && req.user) {
        const user = await User.findById(req.user._id);
        const userSkillIds = (user?.skills || []).map((s) => s.toString());
        targetSkillIds = (opp.requiredSkills || []).filter(
          (rs) => !userSkillIds.includes(rs.toString())
        );
      } else if (opp) {
        targetSkillIds = opp.requiredSkills || [];
      }
    }

    let filter = { isActive: true };
    if (targetSkillIds.length > 0) {
      filter.skill = { $in: targetSkillIds };
    }

    let resources = await LearningResource.find(filter).populate('skill');

    if (resources.length === 0) {
      // Fallback to active database catalog
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
