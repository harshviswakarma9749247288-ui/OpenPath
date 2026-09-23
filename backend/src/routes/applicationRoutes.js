import express from 'express';
import {
  applyToOpportunity,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, requireRole('student'), applyToOpportunity);
router.get('/', protect, requireRole('student'), getMyApplications);
router.get('/:id', protect, getApplicationById);
router.patch('/:id/status', protect, requireRole('employer'), updateApplicationStatus);

export default router;
