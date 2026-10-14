import express from 'express';
import { getSkills, createOrGetSkill } from '../controllers/skillController.js';

const router = express.Router();

router.get('/', getSkills);
router.post('/', createOrGetSkill);

export default router;
