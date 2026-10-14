import express from 'express';
import {
  getLearningRecommendations,
  getAllLearningResources,
} from '../controllers/learningController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/recommendations', optionalAuth, getLearningRecommendations);
router.get('/resources', getAllLearningResources);

export default router;
