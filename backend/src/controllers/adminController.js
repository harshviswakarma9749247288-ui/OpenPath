import mongoose from 'mongoose';
import os from 'os';
import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
import Skill from '../models/Skill.js';
import LearningResource from '../models/LearningResource.js';
import PlatformContent from '../models/PlatformContent.js';
import { successResponse, errorResponse } from '../utils/response.js';

const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get comprehensive admin analytics & system telemetry
// @route   GET /api/admin/stats
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalEmployers,
      totalAdmins,
      totalOpportunities,
      activeOpportunities,
      closedOpportunities,
      totalApplications,
      totalSkills,
      totalLearningResources,
      applicationStatuses,
      recentUsers,
      recentOpportunities,
      recentApplications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'employer' }),
      User.countDocuments({ role: 'admin' }),
      Opportunity.countDocuments(),
      Opportunity.countDocuments({ status: 'Active' }),
      Opportunity.countDocuments({ status: 'Closed' }),
      Application.countDocuments(),
      Skill.countDocuments(),
      LearningResource.countDocuments(),
      Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      User.find()
        .select('name email role avatar createdAt status')
        .sort({ createdAt: -1 })
        .limit(6),
      Opportunity.find()
        .select('title organization type status deadline createdAt')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(6),
      Application.find()
        .select('status appliedAt user opportunity')
        .populate('user', 'name email avatar')
        .populate('opportunity', 'title organization')
        .sort({ appliedAt: -1 })
        .limit(6),
    ]);

    // Format application funnel breakdown
    const funnel = {
      Applied: 0,
      Reviewing: 0,
      Shortlisted: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0,
    };
    applicationStatuses.forEach((item) => {
      if (item._id && funnel[item._id] !== undefined) {
        funnel[item._id] = item.count;
      }
    });

    const memoryUsage = process.memoryUsage();

    return successResponse(
      res,
      {
        metrics: {
          totalUsers,
          totalStudents,
          totalEmployers,
          totalAdmins,
          totalOpportunities,
          activeOpportunities,
          closedOpportunities,
          totalApplications,
          totalSkills,
          totalLearningResources,
        },
        funnel,
        recentUsers,
        recentOpportunities,
        recentApplications,
        system: {
          uptime: Math.floor(process.uptime()),
          nodeVersion: process.version,
          platform: os.platform(),
          arch: os.arch(),
          dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
          memoryRssMB: Math.round(memoryUsage.rss / (1024 * 1024)),
          memoryHeapMB: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
        },
      },
      'Admin statistics retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filtering, search, and pagination
// @route   GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 50 } = req.query;

    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const totalUsers = await User.countDocuments(query);

    const users = await User.find(query)
      .select('-password')
      .populate('skills', 'name category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    // Attach opportunity and application counts to each user
    const userIds = users.map((u) => u._id);
    const [oppCounts, appCounts] = await Promise.all([
      Opportunity.aggregate([
        { $match: { createdBy: { $in: userIds } } },
        { $group: { _id: '$createdBy', count: { $sum: 1 } } },
      ]),
      Application.aggregate([
        { $match: { user: { $in: userIds } } },
        { $group: { _id: '$user', count: { $sum: 1 } } },
      ]),
    ]);

    const oppCountMap = {};
    oppCounts.forEach((c) => {
      oppCountMap[c._id.toString()] = c.count;
    });

    const appCountMap = {};
    appCounts.forEach((c) => {
      appCountMap[c._id.toString()] = c.count;
    });

    const enhancedUsers = users.map((u) => {
      const obj = u.toObject();
      obj.postedOpportunitiesCount = oppCountMap[u._id.toString()] || 0;
      obj.submittedApplicationsCount = appCountMap[u._id.toString()] || 0;
      return obj;
    });

    return successResponse(
      res,
      {
        users: enhancedUsers,
        total: totalUsers,
        page: parseInt(page, 10),
        pages: Math.ceil(totalUsers / parseInt(limit, 10)),
      },
      'Users retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (e.g. promote to admin or switch to employer/student)
// @route   PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'employer', 'admin'].includes(role)) {
      return errorResponse(res, 'Invalid role specified', 400);
    }

    if (req.user._id.toString() === id && role !== 'admin') {
      return errorResponse(res, 'You cannot remove your own admin privileges', 400);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, { user }, `User role updated to ${role}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user account status (active/suspended/banned)
// @route   PUT /api/admin/users/:id/status
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, banReason } = req.body;

    if (!['active', 'suspended', 'banned'].includes(status)) {
      return errorResponse(res, 'Invalid status specified (must be active, suspended, or banned)', 400);
    }

    if (req.user._id.toString() === id) {
      return errorResponse(res, 'You cannot change your own account status', 400);
    }

    const updateFields = { status };
    if (status === 'suspended' || status === 'banned') {
      updateFields.banReason = banReason ? String(banReason).trim() : 'Suspended by platform administrator';
      updateFields.bannedAt = new Date();
    } else {
      updateFields.banReason = '';
      updateFields.bannedAt = null;
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    ).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const message = status === 'banned'
      ? `User ID ${user._id} has been banned permanently`
      : status === 'suspended'
      ? `User account has been suspended`
      : `User account has been reactivated successfully`;

    return successResponse(res, { user }, message);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return errorResponse(res, 'You cannot delete your own admin account', 400);
    }

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Clean up applications made by the user
    await Application.deleteMany({ user: id });

    // If employer, delete or close their opportunities and associated applications
    if (user.role === 'employer') {
      const opps = await Opportunity.find({ createdBy: id });
      const oppIds = opps.map((o) => o._id);
      await Application.deleteMany({ opportunity: { $in: oppIds } });
      await Opportunity.deleteMany({ createdBy: id });
    }

    await User.findByIdAndDelete(id);

    return successResponse(res, { deletedId: id }, 'User and associated data deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all opportunities across the entire platform
// @route   GET /api/admin/opportunities
export const getAllOpportunities = async (req, res, next) => {
  try {
    const { search, status, type, page = 1, limit = 50 } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (search && search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [{ title: regex }, { organization: regex }];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Opportunity.countDocuments(query);

    const opportunities = await Opportunity.find(query)
      .populate('createdBy', 'name email companyDetails')
      .populate('requiredSkills', 'name category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    // Add applicant counts
    const oppIds = opportunities.map((o) => o._id);
    const appCounts = await Application.aggregate([
      { $match: { opportunity: { $in: oppIds } } },
      { $group: { _id: '$opportunity', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    appCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const enhanced = opportunities.map((opp) => {
      const obj = opp.toObject();
      obj.applicantCount = countMap[opp._id.toString()] || 0;
      return obj;
    });

    return successResponse(
      res,
      {
        opportunities: enhanced,
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
      'Opportunities retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update opportunity status (Active / Closed / Draft)
// @route   PUT /api/admin/opportunities/:id/status
export const updateOpportunityStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Closed', 'Draft'].includes(status)) {
      return errorResponse(res, 'Invalid status specified', 400);
    }

    const opp = await Opportunity.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!opp) {
      return errorResponse(res, 'Opportunity not found', 404);
    }

    return successResponse(res, { opportunity: opp }, `Opportunity status changed to ${status}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete opportunity
// @route   DELETE /api/admin/opportunities/:id
export const deleteOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const opp = await Opportunity.findById(id);
    if (!opp) {
      return errorResponse(res, 'Opportunity not found', 404);
    }

    await Application.deleteMany({ opportunity: id });
    await Opportunity.findByIdAndDelete(id);

    return successResponse(res, { deletedId: id }, 'Opportunity and related applications deleted');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all skills with system usage counters
// @route   GET /api/admin/skills
export const getAllSkills = async (req, res, next) => {
  try {
    const { search, category } = req.query;

    const query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search && search.trim()) {
      query.name = new RegExp(escapeRegex(search.trim()), 'i');
    }

    const skills = await Skill.find(query).sort({ category: 1, name: 1 });

    // Calculate usage count in opportunities
    const skillIds = skills.map((s) => s._id);
    const oppUsage = await Opportunity.aggregate([
      { $unwind: '$requiredSkills' },
      { $match: { requiredSkills: { $in: skillIds } } },
      { $group: { _id: '$requiredSkills', count: { $sum: 1 } } },
    ]);

    const usageMap = {};
    oppUsage.forEach((u) => {
      usageMap[u._id.toString()] = u.count;
    });

    const enhanced = skills.map((s) => {
      const obj = s.toObject();
      obj.opportunityCount = usageMap[s._id.toString()] || 0;
      return obj;
    });

    return successResponse(res, { skills: enhanced }, 'Skills retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new canonical skill
// @route   POST /api/admin/skills
export const createSkill = async (req, res, next) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !name.trim()) {
      return errorResponse(res, 'Skill name is required', 400);
    }

    const cleanName = name.trim();
    const existing = await Skill.findOne({
      name: new RegExp(`^${escapeRegex(cleanName)}$`, 'i'),
    });

    if (existing) {
      return errorResponse(res, 'A skill with this name already exists', 400);
    }

    const newSkill = await Skill.create({
      name: cleanName,
      category: (category || 'General').trim(),
      description: (description || `Verified skill: ${cleanName}`).trim(),
      isActive: true,
    });

    return successResponse(res, { skill: newSkill }, 'Skill created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing skill
// @route   PUT /api/admin/skills/:id
export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, description, isActive } = req.body;

    const skill = await Skill.findById(id);
    if (!skill) {
      return errorResponse(res, 'Skill not found', 404);
    }

    if (name) skill.name = name.trim();
    if (category) skill.category = category.trim();
    if (description !== undefined) skill.description = description.trim();
    if (isActive !== undefined) skill.isActive = Boolean(isActive);

    await skill.save();

    return successResponse(res, { skill }, 'Skill updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/admin/skills/:id
export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);
    if (!skill) {
      return errorResponse(res, 'Skill not found', 404);
    }

    await Skill.findByIdAndDelete(id);

    return successResponse(res, { deletedId: id }, 'Skill deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications across platform
// @route   GET /api/admin/applications
export const getAllApplications = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const applications = await Application.find(query)
      .populate('user', 'name email education avatar')
      .populate('opportunity', 'title organization type location status')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Application.countDocuments(query);

    return successResponse(
      res,
      {
        applications,
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
      'Platform applications retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update platform announcement or hero text
// @route   PUT /api/admin/platform-content
export const updatePlatformContent = async (req, res, next) => {
  try {
    const { heroAnnouncementText, heroAnnouncementBadge } = req.body;

    let content = await PlatformContent.findOne({ key: 'openpath_main' });
    if (!content) {
      content = new PlatformContent({ key: 'openpath_main' });
    }

    if (heroAnnouncementText !== undefined) {
      content.heroAnnouncement.text = heroAnnouncementText;
    }
    if (heroAnnouncementBadge !== undefined) {
      content.heroAnnouncement.badge = heroAnnouncementBadge;
    }

    content.lastSyncedAt = new Date();
    await content.save();

    return successResponse(res, { content }, 'Platform content updated successfully');
  } catch (error) {
    next(error);
  }
};
