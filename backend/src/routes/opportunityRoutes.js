import express from 'express';
import {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from '../controllers/opportunityController.js';
import { getMatchExplanation } from '../controllers/matchController.js';
import { getSkillGapAnalysis } from '../controllers/skillGapController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getOpportunities);
router.get('/:id', optionalAuth, getOpportunityById);
router.post('/', protect, requireRole('employer'), createOpportunity);
router.put('/:id', protect, requireRole('employer'), updateOpportunity);
router.delete('/:id', protect, requireRole('employer'), deleteOpportunity);

// Explainable matching & Skill gap endpoints
router.get('/:id/match', protect, getMatchExplanation);
router.get('/:id/skill-gap', protect, getSkillGapAnalysis);

export default router;
