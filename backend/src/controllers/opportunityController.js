import mongoose from 'mongoose';
import Opportunity from '../models/Opportunity.js';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import { resolveSkillsToIds } from './userController.js';
import { calculateOpportunityMatch } from '../services/matchingService.js';
import { successResponse, errorResponse } from '../utils/response.js';

const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get all opportunities with filters, live search, sorting and personalized match scores
// @route   GET /api/opportunities
export const getOpportunities = async (req, res, next) => {
  try {
    const {
      search,
      type,
      locationType,
      city,
      skill,
      status = 'Active',
      sortBy = 'latest',
      limit,
    } = req.query;

    const query = {};

    if (status !== 'all') {
      query.status = status;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (locationType && locationType !== 'all') {
      query['location.type'] = locationType;
    }

    if (city) {
      query['location.city'] = new RegExp(escapeRegex(city), 'i');
    }

    if (skill) {
      if (mongoose.Types.ObjectId.isValid(skill) && skill.length === 24) {
        query.requiredSkills = skill;
      } else {
        const matchedSkills = await Skill.find({
          name: new RegExp(escapeRegex(skill), 'i'),
        }).select('_id');
        query.requiredSkills = { $in: matchedSkills.map((s) => s._id) };
      }
    }

    if (search && search.trim()) {
      const cleanSearch = search.trim();
      const searchRegex = new RegExp(escapeRegex(cleanSearch), 'i');

      // Find any skills matching the search term so live search matches skill names too
      const matchingSkills = await Skill.find({
        $or: [{ name: searchRegex }, { category: searchRegex }],
      }).select('_id');
      const matchingSkillIds = matchingSkills.map((s) => s._id);

      const orConditions = [
        { title: searchRegex },
        { organization: searchRegex },
        { description: searchRegex },
        { type: searchRegex },
        { 'location.city': searchRegex },
        { 'location.state': searchRegex },
        { 'location.type': searchRegex },
        { interests: searchRegex },
      ];

      if (matchingSkillIds.length > 0) {
        orConditions.push({ requiredSkills: { $in: matchingSkillIds } });
      }

      query.$or = orConditions;
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'deadline') {
      sortOptions = { deadline: 1 };
    }

    let opportunities = await Opportunity.find(query)
      .populate('requiredSkills')
      .populate('createdBy', 'name email companyDetails')
      .sort(sortOptions);

    // If student user is logged in, attach personalized 5-factor match data
    let user = null;
    if (req.user && req.user.role === 'student') {
      user = await User.findById(req.user._id).populate('skills');
    }

    let mappedResults = opportunities.map((opp) => {
      const oppObj = opp.toObject();
      if (user) {
        const matchData = calculateOpportunityMatch(user, opp);
        oppObj.matchScore = matchData.overallScore;
        oppObj.matchBadge = matchData.matchBadge;
        oppObj.matchedSkillsCount = matchData.matchedSkills.length;
        oppObj.totalSkillsCount = (opp.requiredSkills || []).length;
      } else {
        oppObj.matchScore = null;
      }
      return oppObj;
    });

    if (sortBy === 'match' && user) {
      mappedResults.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    const totalCount = mappedResults.length;
    if (limit && Number(limit) > 0) {
      mappedResults = mappedResults.slice(0, Number(limit));
    }

    return successResponse(res, {
      count: totalCount,
      opportunities: mappedResults,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single opportunity by ID
// @route   GET /api/opportunities/:id
export const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('requiredSkills')
      .populate('createdBy', 'name email companyDetails');

    if (!opportunity) {
      return errorResponse(res, 'Opportunity not found.', 404);
    }

    const oppObj = opportunity.toObject();

    if (req.user && req.user.role === 'student') {
      const user = await User.findById(req.user._id).populate('skills');
      const matchData = calculateOpportunityMatch(user, opportunity);
      oppObj.matchDetails = matchData;
    }

    return successResponse(res, { opportunity: oppObj });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new opportunity (Employer only)
// @route   POST /api/opportunities
export const createOpportunity = async (req, res, next) => {
  try {
    const {
      title,
      description,
      organization,
      type,
      requiredSkills,
      qualification,
      experienceRequired,
      location,
      interests,
      salary,
      deadline,
      responsibilities,
      requirements,
      status = 'Active',
    } = req.body;

    if (!title || !description || !organization || !deadline) {
      return errorResponse(res, 'Title, description, organization, and deadline are required.', 400);
    }

    const resolvedSkills = await resolveSkillsToIds(requiredSkills || []);

    const opportunity = await Opportunity.create({
      title,
      description,
      organization,
      type: type || 'Internship',
      requiredSkills: resolvedSkills,
      qualification: qualification || {},
      experienceRequired: experienceRequired || {},
      location: location || { type: 'Remote' },
      interests: interests || [],
      salary: salary || {},
      deadline: new Date(deadline),
      responsibilities: responsibilities || [],
      requirements: requirements || [],
      status,
      createdBy: req.user._id,
    });

    const populated = await Opportunity.findById(opportunity._id).populate('requiredSkills');

    return successResponse(res, { opportunity: populated }, 'Opportunity created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update opportunity (Employer only)
// @route   PUT /api/opportunities/:id
export const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return errorResponse(res, 'Opportunity not found.', 404);
    }

    // Verify employer ownership
    if (opportunity.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized to edit this opportunity.', 403);
    }

    const updates = { ...req.body };
    if (updates.requiredSkills !== undefined) {
      updates.requiredSkills = await resolveSkillsToIds(updates.requiredSkills);
    }

    Object.assign(opportunity, updates);
    await opportunity.save();

    const populated = await Opportunity.findById(opportunity._id).populate('requiredSkills');

    return successResponse(res, { opportunity: populated }, 'Opportunity updated successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete opportunity (Employer only)
// @route   DELETE /api/opportunities/:id
export const deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return errorResponse(res, 'Opportunity not found.', 404);
    }

    if (opportunity.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized to delete this opportunity.', 403);
    }

    await Opportunity.deleteOne({ _id: opportunity._id });
    return successResponse(res, {}, 'Opportunity deleted successfully.');
  } catch (error) {
    next(error);
  }
};
