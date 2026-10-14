import express from 'express';
import { getRecommendedOpportunities } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/recommended', protect, getRecommendedOpportunities);

export default router;
