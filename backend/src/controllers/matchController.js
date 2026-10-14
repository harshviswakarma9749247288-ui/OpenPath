import Opportunity from '../models/Opportunity.js';
import User from '../models/User.js';
import { calculateOpportunityMatch } from '../services/matchingService.js';
import { successResponse, errorResponse } from '../utils/response.js';

// @desc    Get detailed explainable match breakdown for a specific opportunity
// @route   GET /api/opportunities/:id/match
export const getMatchExplanation = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('requiredSkills')
      .populate('createdBy', 'name email companyDetails');

    if (!opportunity) {
      return errorResponse(res, 'Opportunity not found.', 404);
    }

    const user = await User.findById(req.user._id).populate('skills');
    const matchAnalysis = calculateOpportunityMatch(user, opportunity);

    return successResponse(res, {
      opportunity: {
        _id: opportunity._id,
        title: opportunity.title,
        organization: opportunity.organization,
        type: opportunity.type,
        location: opportunity.location,
        salary: opportunity.salary,
        deadline: opportunity.deadline,
      },
      match: matchAnalysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended opportunities categorized for the Student Dashboard
// @route   GET /api/matches/recommended
export const getRecommendedOpportunities = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('skills');
    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }

    const activeOpportunities = await Opportunity.find({ status: 'Active' })
      .populate('requiredSkills')
      .populate('createdBy', 'name email companyDetails');

    const scored = activeOpportunities.map((opp) => {
      const matchData = calculateOpportunityMatch(user, opp);
      const oppObj = opp.toObject();
      oppObj.matchScore = matchData.overallScore;
      oppObj.matchBadge = matchData.matchBadge;
      oppObj.matchDetails = matchData;
      return oppObj;
    });

    // 1. Best Matches (Overall Score >= 60 sorted descending)
    const bestMatches = [...scored]
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);

    // 2. Based on Your Skills (highest skill contribution)
    const basedOnSkills = [...scored]
      .sort(
        (a, b) =>
          b.matchDetails.breakdown.skillMatch.score - a.matchDetails.breakdown.skillMatch.score
      )
      .slice(0, 4);

    // 3. Based on Your Interests (highest interest match)
    const basedOnInterests = [...scored]
      .sort(
        (a, b) =>
          b.matchDetails.breakdown.interest.score - a.matchDetails.breakdown.interest.score
      )
      .slice(0, 4);

    return successResponse(res, {
      bestMatches,
      basedOnSkills,
      basedOnInterests,
    });
  } catch (error) {
    next(error);
  }
};
