import { calculateOpportunityMatch } from './matchingService.js';

export const analyzeSkillGap = (user, opportunity) => {
  const matchResult = calculateOpportunityMatch(user, opportunity);

  const matchedList = matchResult.matchedSkills.map((skill) => ({
    _id: skill._id,
    name: skill.name,
    category: skill.category,
    status: 'matched',
    message: 'Profile verified with this competency',
  }));

  const missingList = matchResult.missingSkills.map((skill, index) => ({
    _id: skill._id,
    name: skill.name,
    category: skill.category,
    status: 'missing',
    priority: index === 0 ? 'High Priority' : 'Recommended',
    actionText: `Learn ${skill.name}`,
  }));

  const total = matchedList.length + missingList.length;
  const readiness = total > 0 ? Math.round((matchedList.length / total) * 100) : 100;

  return {
    opportunityId: opportunity._id,
    opportunityTitle: opportunity.title,
    organization: opportunity.organization,
    readinessPercentage: readiness,
    matchedCount: matchedList.length,
    missingCount: missingList.length,
    matchedSkills: matchedList,
    missingSkills: missingList,
    recommendationNote:
      missingList.length === 0
        ? 'You have 100% of the required skills for this role! You are strongly encouraged to apply.'
        : `Bridging ${missingList.length} missing skill${missingList.length > 1 ? 's' : ''} will significantly boost your selection chance.`,
  };
};
