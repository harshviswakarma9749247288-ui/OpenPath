import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import { calculateOpportunityMatch } from '../services/matchingService.js';
import { successResponse, errorResponse } from '../utils/response.js';

// @desc    Get all opportunities posted by the employer
// @route   GET /api/employer/opportunities
export const getEmployerOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({ createdBy: req.user._id })
      .populate('requiredSkills')
      .sort({ createdAt: -1 });

    // Attach application counts for each opportunity
    const opportunitiesWithStats = await Promise.all(
      opportunities.map(async (opp) => {
        const totalApplicants = await Application.countDocuments({ opportunity: opp._id });
        const shortlisted = await Application.countDocuments({
          opportunity: opp._id,
          status: 'Shortlisted',
        });
        const interviews = await Application.countDocuments({
          opportunity: opp._id,
          status: 'Interview',
        });
        return {
          ...opp.toObject(),
          totalApplicants,
          shortlisted,
          interviews,
        };
      })
    );

    return successResponse(res, {
      count: opportunitiesWithStats.length,
      opportunities: opportunitiesWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidates for a specific employer opportunity with match breakdown
// @route   GET /api/employer/opportunities/:id/candidates
export const getCandidatesForOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('requiredSkills');
    if (!opportunity) {
      return errorResponse(res, 'Opportunity not found.', 404);
    }

    if (opportunity.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized to view candidates for this opportunity.', 403);
    }

    const applications = await Application.find({ opportunity: opportunity._id })
      .populate({
        path: 'user',
        populate: { path: 'skills' },
      })
      .sort({ appliedAt: -1 });

    const candidates = applications.map((app) => {
      const user = app.user;
      const matchData = calculateOpportunityMatch(user, opportunity);

      return {
        applicationId: app._id,
        status: app.status,
        appliedAt: app.appliedAt,
        timeline: app.timeline,
        notes: app.notes,
        interviewDetails: app.interviewDetails,
        matchScore: matchData.overallScore,
        matchBadge: matchData.matchBadge,
        breakdown: matchData.breakdown,
        matchedSkills: matchData.matchedSkills,
        missingSkills: matchData.missingSkills,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          education: user.education,
          skills: user.skills,
          experience: user.experience,
          location: user.location,
          resumeUrl: user.resumeUrl,
        },
      };
    });

    // Sort candidates by match score descending
    candidates.sort((a, b) => b.matchScore - a.matchScore);

    return successResponse(res, {
      opportunity: {
        _id: opportunity._id,
        title: opportunity.title,
        organization: opportunity.organization,
        type: opportunity.type,
      },
      candidateCount: candidates.length,
      candidates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employer dashboard overview metrics
// @route   GET /api/employer/dashboard-stats
export const getEmployerDashboardStats = async (req, res, next) => {
  try {
    const oppIds = await Opportunity.find({ createdBy: req.user._id }).distinct('_id');

    const totalListings = oppIds.length;
    const activeListings = await Opportunity.countDocuments({
      createdBy: req.user._id,
      status: 'Active',
    });

    const totalApplications = await Application.countDocuments({ opportunity: { $in: oppIds } });
    const shortlistedCount = await Application.countDocuments({
      opportunity: { $in: oppIds },
      status: 'Shortlisted',
    });
    const interviewCount = await Application.countDocuments({
      opportunity: { $in: oppIds },
      status: 'Interview',
    });
    const selectedCount = await Application.countDocuments({
      opportunity: { $in: oppIds },
      status: 'Selected',
    });

    const recentApplications = await Application.find({ opportunity: { $in: oppIds } })
      .populate('user', 'name email education skills')
      .populate('opportunity', 'title organization')
      .sort({ appliedAt: -1 })
      .limit(6);

    return successResponse(res, {
      stats: {
        totalListings,
        activeListings,
        totalApplications,
        shortlistedCount,
        interviewCount,
        selectedCount,
      },
      recentApplications,
    });
  } catch (error) {
    next(error);
  }
};
