import Application from '../models/Application.js';
import Opportunity from '../models/Opportunity.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/response.js';

// @desc    Apply to an opportunity
// @route   POST /api/applications
export const applyToOpportunity = async (req, res, next) => {
  try {
    const { opportunityId, notes } = req.body;

    if (!opportunityId) {
      return errorResponse(res, 'Opportunity ID is required.', 400);
    }

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return errorResponse(res, 'Opportunity not found.', 404);
    }

    if (opportunity.status !== 'Active') {
      return errorResponse(res, 'This opportunity is no longer accepting applications.', 400);
    }

    // Check duplicate
    const existing = await Application.findOne({
      user: req.user._id,
      opportunity: opportunityId,
    });

    if (existing) {
      return errorResponse(
        res,
        'You have already applied for this opportunity. You can track its status in your Applications dashboard.',
        400
      );
    }

    const application = await Application.create({
      user: req.user._id,
      opportunity: opportunityId,
      status: 'Applied',
      notes: notes || '',
      timeline: [
        {
          stage: 'Applied',
          timestamp: new Date(),
          note: `Application submitted for ${opportunity.title} at ${opportunity.organization}.`,
        },
      ],
    });

    // Create confirmation notification
    await Notification.create({
      user: req.user._id,
      type: 'application_status',
      title: 'Application Submitted!',
      message: `Your application for ${opportunity.title} has been received by ${opportunity.organization}.`,
      relatedOpportunity: opportunity._id,
      relatedApplication: application._id,
    });

    const populated = await Application.findById(application._id).populate({
      path: 'opportunity',
      populate: { path: 'requiredSkills' },
    });

    return successResponse(
      res,
      { application: populated },
      'Application submitted successfully!',
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications submitted by logged-in student
// @route   GET /api/applications
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate({
        path: 'opportunity',
        populate: { path: 'requiredSkills' },
      })
      .sort({ appliedAt: -1 });

    return successResponse(res, {
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'opportunity',
        populate: { path: 'requiredSkills' },
      })
      .populate('user', 'name email education skills experience location resumeUrl');

    if (!application) {
      return errorResponse(res, 'Application not found.', 404);
    }

    // Role check: Only the applicant or the opportunity owner can view
    const isOwnerStudent = application.user._id.toString() === req.user._id.toString();
    const isOpportunityEmployer =
      application.opportunity?.createdBy?.toString() === req.user._id.toString();

    if (!isOwnerStudent && !isOpportunityEmployer) {
      return errorResponse(res, 'Access denied.', 403);
    }

    return successResponse(res, { application });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Employer only)
// @route   PATCH /api/applications/:id/status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note, interviewDetails } = req.body;

    const validStatuses = ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Rejected', 'Selected'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const application = await Application.findById(req.params.id).populate('opportunity');
    if (!application) {
      return errorResponse(res, 'Application not found.', 404);
    }

    // Check employer ownership of opportunity
    if (application.opportunity.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized to update this application.', 403);
    }

    application.status = status;
    application.lastUpdatedAt = new Date();

    const stageNote = note || `Status updated to ${status}.`;
    application.timeline.push({
      stage: status,
      timestamp: new Date(),
      note: stageNote,
    });

    if (status === 'Interview' && interviewDetails) {
      application.interviewDetails = interviewDetails;
    }

    await application.save();

    // Create notification for student
    await Notification.create({
      user: application.user,
      type: 'application_status',
      title: `Application Update: ${status}`,
      message: `Your application status for "${application.opportunity.title}" changed to ${status}.`,
      relatedOpportunity: application.opportunity._id,
      relatedApplication: application._id,
    });

    return successResponse(res, { application }, `Application status updated to ${status}.`);
  } catch (error) {
    next(error);
  }
};
