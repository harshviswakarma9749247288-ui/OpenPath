import express from 'express';
import {
  getEmployerOpportunities,
  getCandidatesForOpportunity,
  getEmployerDashboardStats,
} from '../controllers/employerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/opportunities', protect, requireRole('employer'), getEmployerOpportunities);
router.get('/opportunities/:id/candidates', protect, requireRole('employer'), getCandidatesForOpportunity);
router.get('/dashboard-stats', protect, requireRole('employer'), getEmployerDashboardStats);

export default router;
