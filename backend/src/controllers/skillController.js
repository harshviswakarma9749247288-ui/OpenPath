import Skill from '../models/Skill.js';
import { successResponse, errorResponse } from '../utils/response.js';

const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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
      query.name = new RegExp(escapeRegex(search), 'i');
    }

    const skills = await Skill.find(query).sort({ category: 1, name: 1 });
    return successResponse(res, { count: skills.length, skills });
  } catch (error) {
    next(error);
  }
};

// @desc    Find existing skill by name or create it in the database if it does not exist
// @route   POST /api/skills
export const createOrGetSkill = async (req, res, next) => {
  try {
    const { name, category = 'General', description = '' } = req.body;
    if (!name || !name.trim()) {
      return errorResponse(res, 'Skill name is required.', 400);
    }

    const cleanName = name.trim();
    let skill = await Skill.findOne({
      name: new RegExp(`^${escapeRegex(cleanName)}$`, 'i'),
    });

    if (!skill) {
      skill = await Skill.create({
        name: cleanName,
        category,
        description: description || `Verified skill: ${cleanName}`,
        isActive: true,
      });
    }

    return successResponse(res, { skill }, 'Skill synchronized with database.');
  } catch (error) {
    next(error);
  }
};
