import LearningResource from '../models/LearningResource.js';

export const getLearningForSkills = async (skillIds) => {
  if (!skillIds || skillIds.length === 0) {
    // Return all active curated resources
    return await LearningResource.find({ isActive: true }).populate('skill');
  }

  const resources = await LearningResource.find({
    skill: { $in: skillIds },
    isActive: true,
  }).populate('skill');

  return resources;
};

export const groupLearningByRoadmap = (resources) => {
  const roadmapStages = [
    { id: 'gap', title: 'Skill Gap', step: 1, description: 'Identify current missing proficiencies' },
    { id: 'beginner', title: 'Beginner Foundations', step: 2, description: 'Core syntax, concepts & mental models' },
    { id: 'practice', title: 'Practice & Exercises', step: 3, description: 'Hands-on problem solving & coding katas' },
    { id: 'project', title: 'Real-world Project', step: 4, description: 'Portfolio-ready implementation' },
    { id: 'ready', title: 'Job Ready', step: 5, description: 'Interview prep & technical readiness' },
  ];

  const grouped = roadmapStages.map((stage) => {
    const items = resources.filter((r) => {
      if (stage.id === 'gap') return r.roadmapStage === 'Skill Gap' || !r.roadmapStage;
      if (stage.id === 'beginner') return r.roadmapStage === 'Beginner' || r.difficulty === 'Beginner';
      if (stage.id === 'practice') return r.roadmapStage === 'Practice' || r.difficulty === 'Intermediate';
      if (stage.id === 'project') return r.roadmapStage === 'Project' || r.type === 'Project';
      if (stage.id === 'ready') return r.roadmapStage === 'Ready' || r.difficulty === 'Advanced';
      return false;
    });

    return {
      ...stage,
      resources: items,
    };
  });

  return grouped;
};
