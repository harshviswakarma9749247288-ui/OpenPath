import Skill from '../models/Skill.js';
import { successResponse } from '../utils/response.js';

// @desc    Get all active skills grouped or sorted
// @route   GET /api/skills
export const getSkills = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = new RegExp(search, 'i');
    }

    const skills = await Skill.find(query).sort({ category: 1, name: 1 });
    return successResponse(res, { count: skills.length, skills });
  } catch (error) {
    next(error);
  }
};
