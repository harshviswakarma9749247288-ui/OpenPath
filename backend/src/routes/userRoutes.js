import express from 'express';
import {
  getCurrentUser,
  updateCurrentUser,
  toggleSavedOpportunity,
  toggleCompletedLearning,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getCurrentUser);
router.put('/me', protect, updateCurrentUser);
router.post('/me/saved-opportunities/:opportunityId', protect, toggleSavedOpportunity);
router.post('/me/completed-learning/:resourceId', protect, toggleCompletedLearning);

export default router;
