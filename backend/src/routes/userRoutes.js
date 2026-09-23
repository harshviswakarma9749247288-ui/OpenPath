import express from 'express';
import { getCurrentUser, updateCurrentUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getCurrentUser);
router.put('/me', protect, updateCurrentUser);

export default router;
