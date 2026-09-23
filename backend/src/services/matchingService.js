/**
 * OpenPath Intelligent Matching Service
 * Strict implementation of the PRD 5-factor explainable matching model:
 * 1. Skill Match — 40%
 * 2. Qualification — 20%
 * 3. Location — 20%
 * 4. Interest — 10%
 * 5. Experience — 10%
 */

export const calculateOpportunityMatch = (user, opportunity) => {
  if (!user || !opportunity) {
    return {
      overallScore: 0,
      breakdown: {},
      matchedSkills: [],
      missingSkills: [],
      matchBadge: 'red',
    };
  }

  // 1. Skill Match (40%)
  const userSkillIds = (user.skills || []).map((s) => (s._id || s).toString());
  const userSkillNames = (user.skills || []).map((s) => (s.name || '').toLowerCase().trim());
  const requiredSkills = opportunity.requiredSkills || [];

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((reqSkill) => {
    const reqId = (reqSkill._id || reqSkill).toString();
    const reqName = (reqSkill.name || '').toLowerCase().trim();

    const isMatch =
      userSkillIds.includes(reqId) ||
      (reqName && userSkillNames.some((un) => un === reqName || un.includes(reqName) || reqName.includes(un)));

    if (isMatch) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const totalRequired = requiredSkills.length;
  let skillPercentage = 100;
  if (totalRequired > 0) {
    skillPercentage = Math.round((matchedSkills.length / totalRequired) * 100);
  }
  const skillContribution = (skillPercentage / 100) * 40;

  // 2. Qualification Match (20%)
  let qualPercentage = 60; // default baseline for student
  let qualDetails = 'General alignment for college/entry qualifications';
  const oppDegree = (opportunity.qualification?.degree || '').toLowerCase();
  const userDegree = (user.education?.degree || '').toLowerCase();
  const oppField = (opportunity.qualification?.field || '').toLowerCase();
  const userField = (user.education?.fieldOfStudy || '').toLowerCase();

  if (!oppDegree || oppDegree === 'any' || oppDegree === 'all') {
    qualPercentage = 100;
    qualDetails = 'Open to all academic backgrounds';
  } else if (userDegree && (userDegree.includes(oppDegree) || oppDegree.includes(userDegree))) {
    qualPercentage = 100;
    qualDetails = `Degree closely matches requirement (${user.education.degree})`;
  } else if (userField && oppField && (userField.includes(oppField) || oppField.includes(userField))) {
    qualPercentage = 85;
    qualDetails = `Field of study matches (${user.education.fieldOfStudy})`;
  } else if (userDegree) {
    qualPercentage = 75;
    qualDetails = `Pursuing degree ${user.education.degree}`;
  }
  const qualContribution = (qualPercentage / 100) * 20;

  // 3. Location Match (20%)
  let locPercentage = 50;
  let locDetails = 'Location differences apply';
  const oppLocType = opportunity.location?.type || 'Remote';
  const oppCity = (opportunity.location?.city || '').toLowerCase().trim();
  const userCity = (user.location?.city || '').toLowerCase().trim();
  const userRemotePref = user.location?.remotePreference || 'Any';

  if (oppLocType === 'Remote') {
    locPercentage = 100;
    locDetails = 'Fully remote position — eligible from any location';
  } else if (oppCity && userCity && (oppCity === userCity || oppCity.includes(userCity) || userCity.includes(oppCity))) {
    locPercentage = 100;
    locDetails = `Exact city location match in ${opportunity.location.city}`;
  } else if (userRemotePref === 'Remote' && oppLocType !== 'Remote') {
    locPercentage = 30;
    locDetails = `Role is ${oppLocType} in ${opportunity.location.city}, prefer remote`;
  } else {
    locPercentage = 65;
    locDetails = `${oppLocType} role in ${opportunity.location?.city || 'designated location'}`;
  }
  const locContribution = (locPercentage / 100) * 20;

  // 4. Interest Match (10%)
  let interestPercentage = 60;
  let interestDetails = 'General industry alignment';
  const userInterests = (user.interests || []).map((i) => i.toLowerCase().trim());
  const oppInterests = (opportunity.interests || []).map((i) => i.toLowerCase().trim());

  const matchedInterests = oppInterests.filter((oi) =>
    userInterests.some((ui) => ui.includes(oi) || oi.includes(ui))
  );

  if (matchedInterests.length > 0) {
    interestPercentage = 100;
    interestDetails = `Strong alignment with interests: ${matchedInterests.slice(0, 3).join(', ')}`;
  } else if (userInterests.length > 0) {
    // Check title/category
    const titleLower = opportunity.title.toLowerCase();
    const hasKeyword = userInterests.some((ui) => titleLower.includes(ui));
    if (hasKeyword) {
      interestPercentage = 90;
      interestDetails = 'Opportunity title aligns with your stated career interests';
    }
  }
  const interestContribution = (interestPercentage / 100) * 10;

  // 5. Experience Match (10%)
  let expPercentage = 75;
  let expDetails = 'Entry-level / fresher profile suitable';
  const minYears = opportunity.experienceRequired?.minYears || 0;
  const oppLevel = (opportunity.experienceRequired?.level || '').toLowerCase();

  if (minYears === 0 || oppLevel.includes('fresher') || oppLevel.includes('entry') || opportunity.type === 'Internship') {
    expPercentage = 100;
    expDetails = 'Perfect for students & freshers (no prior years required)';
  } else if (user.experience?.role || user.experience?.organization) {
    expPercentage = 90;
    expDetails = 'Candidate has relevant practical / project experience';
  }
  const expContribution = (expPercentage / 100) * 10;

  // Final overall score calculation
  const totalScore = Math.min(
    100,
    Math.max(
      10,
      Math.round(skillContribution + qualContribution + locContribution + interestContribution + expContribution)
    )
  );

  let matchBadge = 'red';
  if (totalScore >= 80) matchBadge = 'green';
  else if (totalScore >= 50) matchBadge = 'yellow';

  return {
    overallScore: totalScore,
    matchBadge,
    breakdown: {
      skillMatch: {
        weight: 40,
        score: skillPercentage,
        contribution: Math.round(skillContribution * 10) / 10,
        details: `${matchedSkills.length} of ${totalRequired} required skills in your profile`,
      },
      qualification: {
        weight: 20,
        score: qualPercentage,
        contribution: Math.round(qualContribution * 10) / 10,
        details: qualDetails,
      },
      location: {
        weight: 20,
        score: locPercentage,
        contribution: Math.round(locContribution * 10) / 10,
        details: locDetails,
      },
      interest: {
        weight: 10,
        score: interestPercentage,
        contribution: Math.round(interestContribution * 10) / 10,
        details: interestDetails,
      },
      experience: {
        weight: 10,
        score: expPercentage,
        contribution: Math.round(expContribution * 10) / 10,
        details: expDetails,
      },
    },
    matchedSkills,
    missingSkills,
    summary:
      totalScore >= 80
        ? 'High Compatibility: Your profile strongly matches this role across core technical requirements.'
        : totalScore >= 50
        ? 'Moderate Compatibility: Good baseline fit with specific skill gaps you can bridge.'
        : 'Growth Opportunity: Additional foundational skills recommended before applying.',
  };
};
