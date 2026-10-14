import Opportunity from '../models/Opportunity.js';
import User from '../models/User.js';
import { analyzeSkillGap } from '../services/skillGapService.js';
import { successResponse, errorResponse } from '../utils/response.js';

// @desc    Get skill gap breakdown for an opportunity
// @route   GET /api/opportunities/:id/skill-gap
export const getSkillGapAnalysis = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('requiredSkills');
    if (!opportunity) {
      return errorResponse(res, 'Opportunity not found.', 404);
    }

    const user = await User.findById(req.user._id).populate('skills');
    const gapAnalysis = analyzeSkillGap(user, opportunity);

    return successResponse(res, { skillGap: gapAnalysis });
  } catch (error) {
    next(error);
  }
};
