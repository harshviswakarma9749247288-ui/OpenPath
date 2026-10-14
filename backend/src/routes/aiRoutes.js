import express from 'express';
import { handleAiChat, handleAiStream } from '../controllers/aiAgentController.js';

const router = express.Router();

router.post('/chat', handleAiChat);
router.post('/stream', handleAiStream);

export default router;