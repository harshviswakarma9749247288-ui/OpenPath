import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAllOpportunities,
  updateOpportunityStatus,
  deleteOpportunity,
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getAllApplications,
  updatePlatformContent,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply auth and admin role check to all admin routes
router.use(protect, requireRole('admin'));

// Stats & Overview
router.get('/stats', getAdminStats);

// Users Management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Opportunities Moderation
router.get('/opportunities', getAllOpportunities);
router.put('/opportunities/:id/status', updateOpportunityStatus);
router.delete('/opportunities/:id', deleteOpportunity);

// Skills Management
router.get('/skills', getAllSkills);
router.post('/skills', createSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Platform Applications
router.get('/applications', getAllApplications);

// Platform Content
router.put('/platform-content', updatePlatformContent);

export default router;
