import {
  INITIAL_SKILLS,
  INITIAL_OPPORTUNITIES,
  INITIAL_LEARNING_RESOURCES,
  INITIAL_APPLICATIONS,
  DEMO_STUDENT,
  DEMO_EMPLOYER,
} from './mockData.js';

// Safe storage proxy for browser localStorage or Node environments
const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {}
    return null;
  },
  setItem: (key, val) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch (e) {}
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {}
  },
};

// Persistent LocalStorage keys
const STORAGE_KEYS = {
  OPPORTUNITIES: 'openpath_mock_opportunities',
  APPLICATIONS: 'openpath_mock_applications',
  USER: 'openpath_mock_user',
  TOKEN: 'openpath_token',
  SAVED: 'openpath_saved_opps',
};

// Initialize or retrieve localStorage collections
function getStoredCollection(key, defaultData) {
  try {
    const item = safeStorage.getItem(key);
    if (!item) {
      safeStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch (e) {
    return defaultData;
  }
}

function setStoredCollection(key, data) {
  try {
    safeStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

// 5-Factor Explainable Matching Algorithm
export function calculateMatchScore(student, opportunity) {
  if (!student || !opportunity) return { overallScore: 75, factors: {}, breakdown: [] };

  const studentSkills = (student.skills || []).map((s) => (typeof s === 'string' ? s : s.name).toLowerCase());
  const reqSkills = (opportunity.requiredSkills || []).map((s) => (typeof s === 'string' ? s : s.name).toLowerCase());

  // 1. Skill Match (40 pts)
  const matched = reqSkills.filter((s) => studentSkills.some((sk) => sk === s || sk.includes(s) || s.includes(sk)));
  const skillRatio = reqSkills.length > 0 ? matched.length / reqSkills.length : 1;
  const skillScore = Math.round(skillRatio * 40);

  // 2. Academic Qualification (20 pts)
  let acadScore = 18;
  if (student.education?.degree && opportunity.qualification?.degree) {
    const deg1 = student.education.degree.toLowerCase();
    const deg2 = opportunity.qualification.degree.toLowerCase();
    if (deg1.includes('b.tech') || deg2.includes('any') || deg1.includes('computer')) {
      acadScore = 20;
    }
  }

  // 3. Location (20 pts)
  let locScore = 15;
  if (opportunity.location?.type === 'Remote' || student.location?.remotePreference === 'Remote') {
    locScore = 20;
  } else if (
    opportunity.location?.city &&
    student.location?.city &&
    opportunity.location.city.toLowerCase() === student.location.city.toLowerCase()
  ) {
    locScore = 20;
  }

  // 4. Interests (10 pts)
  const studentInterests = (student.interests || []).map((i) => i.toLowerCase());
  const oppInterests = (opportunity.interests || []).map((i) => i.toLowerCase());
  const matchedInterests = oppInterests.filter((i) => studentInterests.includes(i));
  const interestScore = matchedInterests.length > 0 ? 10 : 7;

  // 5. Experience (10 pts)
  let expScore = 9;
  if (opportunity.experienceRequired?.minYears === 0) {
    expScore = 10;
  }

  const overallScore = Math.min(100, Math.max(30, skillScore + acadScore + locScore + interestScore + expScore));

  return {
    overallScore,
    badge: overallScore >= 80 ? 'High Match' : overallScore >= 50 ? 'Good Match' : 'Growth Opportunity',
    badgeClass: overallScore >= 80 ? 'badge-high-match' : overallScore >= 50 ? 'badge-good-match' : 'badge-low-match',
    factors: {
      skillMatch: { score: skillScore, max: 40, percentage: Math.round((skillScore / 40) * 100), label: 'Skill Match (40%)' },
      qualification: { score: acadScore, max: 20, percentage: Math.round((acadScore / 20) * 100), label: 'Academic Alignment (20%)' },
      location: { score: locScore, max: 20, percentage: Math.round((locScore / 20) * 100), label: 'Location & Mode (20%)' },
      interests: { score: interestScore, max: 10, percentage: Math.round((interestScore / 10) * 100), label: 'Industry Interests (10%)' },
      experience: { score: expScore, max: 10, percentage: Math.round((expScore / 10) * 100), label: 'Fresher Suitability (10%)' },
    },
    matchedSkills: matched,
    missingSkills: reqSkills.filter((s) => !matched.includes(s)),
  };
}

export function computeProfileCompletion(user) {
  if (!user) return { percentage: 0, missingFields: ['Sign in required'], isComplete: false };
  const missing = [];
  if (!user.name) missing.push('Full Name');
  if (!user.bio) missing.push('Bio Statement');
  if (!user.education?.degree) missing.push('Education Degree');
  if (!user.skills || user.skills.length === 0) missing.push('Technical Skills');
  if (!user.interests || user.interests.length === 0) missing.push('Career Interests');
  if (!user.location?.city) missing.push('Location Details');

  const totalFields = 6;
  const completed = totalFields - missing.length;
  const percentage = Math.round((completed / totalFields) * 100);

  return {
    percentage,
    missingFields: missing,
    isComplete: missing.length === 0,
  };
}

// In-Memory & LocalStorage Mock Engine
export const MockServer = {
  // Stats overview
  getStatsOverview: () => {
    const opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const apps = getStoredCollection(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    return {
      success: true,
      data: {
        totalOpportunities: opps.length + 120,
        totalStudents: 4850,
        totalEmployers: 1240,
        totalSkills: INITIAL_SKILLS.length,
        totalApplications: apps.length + 1840,
      },
    };
  },

  // Auth
  getCurrentUser: () => {
    let user = getStoredCollection(STORAGE_KEYS.USER, DEMO_STUDENT);
    const profileCompletion = computeProfileCompletion(user);
    return {
      success: true,
      data: {
        user,
        profileCompletion,
      },
    };
  },

  demoLogin: (role = 'student') => {
    const targetUser = role === 'employer' ? { ...DEMO_EMPLOYER } : { ...DEMO_STUDENT };
    setStoredCollection(STORAGE_KEYS.USER, targetUser);
    safeStorage.setItem(STORAGE_KEYS.TOKEN, `mock_jwt_token_${role}_${Date.now()}`);
    return {
      success: true,
      data: {
        user: targetUser,
        token: `mock_jwt_token_${role}_${Date.now()}`,
        profileCompletion: computeProfileCompletion(targetUser),
      },
    };
  },

  login: (email, password) => {
    let targetUser = { ...DEMO_STUDENT };
    if (email.toLowerCase().includes('recruiter') || email.toLowerCase().includes('employer')) {
      targetUser = { ...DEMO_EMPLOYER, email };
    } else {
      targetUser.email = email;
    }
    setStoredCollection(STORAGE_KEYS.USER, targetUser);
    safeStorage.setItem(STORAGE_KEYS.TOKEN, `mock_jwt_token_${Date.now()}`);
    return {
      success: true,
      data: {
        user: targetUser,
        token: `mock_jwt_token_${Date.now()}`,
      },
    };
  },

  register: (userData) => {
    const newUser = {
      _id: `usr_${Date.now()}`,
      ...userData,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      profileCompleted: false,
    };
    setStoredCollection(STORAGE_KEYS.USER, newUser);
    safeStorage.setItem(STORAGE_KEYS.TOKEN, `mock_jwt_token_${Date.now()}`);
    return {
      success: true,
      data: {
        user: newUser,
        token: `mock_jwt_token_${Date.now()}`,
      },
    };
  },

  updateProfile: (payload) => {
    const current = getStoredCollection(STORAGE_KEYS.USER, DEMO_STUDENT);
    const updated = { ...current, ...payload };
    setStoredCollection(STORAGE_KEYS.USER, updated);
    return {
      success: true,
      data: {
        user: updated,
        profileCompletion: computeProfileCompletion(updated),
      },
    };
  },

  logout: () => {
    safeStorage.removeItem(STORAGE_KEYS.TOKEN);
    return { success: true };
  },

  // Opportunities
  getOpportunities: (search = '', type = 'all', locationType = 'all', sortBy = 'latest', limit) => {
    let opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const user = getStoredCollection(STORAGE_KEYS.USER, DEMO_STUDENT);

    // Compute dynamic match scores
    opps = opps.map((opp) => {
      const match = calculateMatchScore(user, opp);
      return {
        ...opp,
        matchScore: match.overallScore,
        matchDetails: match,
      };
    });

    // Filter search
    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      opps = opps.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.organization.toLowerCase().includes(q) ||
          (o.requiredSkills || []).some((s) => (s.name || s).toLowerCase().includes(q)) ||
          (o.location?.city || '').toLowerCase().includes(q)
      );
    }

    // Filter type
    if (type && type !== 'all') {
      opps = opps.filter((o) => o.type.toLowerCase().includes(type.toLowerCase()));
    }

    // Filter locationType
    if (locationType && locationType !== 'all') {
      opps = opps.filter((o) => o.location?.type.toLowerCase() === locationType.toLowerCase());
    }

    // Sorting
    if (sortBy === 'match') {
      opps.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else {
      opps.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    if (limit) {
      opps = opps.slice(0, parseInt(limit, 10));
    }

    return {
      success: true,
      data: {
        opportunities: opps,
        total: opps.length,
      },
    };
  },

  getOpportunityById: (id) => {
    const opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const user = getStoredCollection(STORAGE_KEYS.USER, DEMO_STUDENT);
    const opp = opps.find((o) => o._id === id) || opps[0];
    const match = calculateMatchScore(user, opp);

    return {
      success: true,
      data: {
        opportunity: {
          ...opp,
          matchScore: match.overallScore,
          matchDetails: match,
        },
      },
    };
  },

  createOpportunity: (payload) => {
    const opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const newOpp = {
      _id: `opp_${Date.now()}`,
      ...payload,
      organization: payload.organization || 'TechCorp Labs',
      organizationLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      status: 'Active',
      applicantCount: 0,
      createdAt: new Date().toISOString(),
      matchScore: 90,
    };
    const updated = [newOpp, ...opps];
    setStoredCollection(STORAGE_KEYS.OPPORTUNITIES, updated);
    return {
      success: true,
      data: { opportunity: newOpp },
    };
  },

  updateOpportunity: (id, payload) => {
    const opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const updated = opps.map((o) => (o._id === id ? { ...o, ...payload } : o));
    setStoredCollection(STORAGE_KEYS.OPPORTUNITIES, updated);
    const found = updated.find((o) => o._id === id);
    return { success: true, data: { opportunity: found } };
  },

  deleteOpportunity: (id) => {
    const opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const updated = opps.filter((o) => o._id !== id);
    setStoredCollection(STORAGE_KEYS.OPPORTUNITIES, updated);
    return { success: true };
  },

  // 5-Factor Match Details
  getMatchExplanation: (oppId) => {
    const opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const user = getStoredCollection(STORAGE_KEYS.USER, DEMO_STUDENT);
    const opp = opps.find((o) => o._id === oppId) || opps[0];
    const match = calculateMatchScore(user, opp);

    return {
      success: true,
      data: {
        match: {
          opportunityId: opp._id,
          overallScore: match.overallScore,
          badge: match.badge,
          factors: match.factors,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
          summary: `Candidate profile matches ${match.overallScore}% of requirements with strongest alignment in Skill Match (${match.factors.skillMatch.percentage}%) and Location Compatibility.`,
        },
      },
    };
  },

  // Skill Gap Analysis
  getSkillGap: (oppId) => {
    const opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const user = getStoredCollection(STORAGE_KEYS.USER, DEMO_STUDENT);
    const opp = opps.find((o) => o._id === oppId) || opps[0];
    const match = calculateMatchScore(user, opp);

    const missingWithPriority = match.missingSkills.map((skName, idx) => ({
      name: skName.toUpperCase(),
      priority: idx === 0 ? 'High Priority' : 'Recommended',
      estimatedHours: (idx + 1) * 4,
      category: 'Technical Competency',
    }));

    return {
      success: true,
      data: {
        skillGap: {
          opportunityId: opp._id,
          title: opp.title,
          readinessPercentage: Math.max(45, match.overallScore),
          matchedSkills: match.matchedSkills.map((s) => ({ name: s.toUpperCase(), status: 'Mastered' })),
          missingSkills: missingWithPriority,
          recommendedAction:
            missingWithPriority.length > 0
              ? `Focus on bridging ${missingWithPriority[0].name} to increase match score to 95%+.`
              : 'You have verified competency across all required skills. Ready to apply!',
        },
      },
    };
  },

  // Learning Recommendations
  getLearningRecommendations: (oppId, skillName) => {
    let resources = [...INITIAL_LEARNING_RESOURCES];
    if (skillName) {
      resources = resources.filter(
        (r) => r.skill?.name?.toLowerCase().includes(skillName.toLowerCase()) || r.title.toLowerCase().includes(skillName.toLowerCase())
      );
    }
    if (resources.length === 0) {
      resources = INITIAL_LEARNING_RESOURCES.slice(0, 4);
    }

    return {
      success: true,
      data: {
        resources,
        roadmap: [
          { stage: 'Skill Gap', desc: 'Identify competency discrepancies', count: 2 },
          { stage: 'Beginner', desc: 'Core syntax and foundational concepts', count: resources.filter((r) => r.roadmapStage === 'Beginner').length },
          { stage: 'Practice', desc: 'Interactive coding exercises & drills', count: resources.filter((r) => r.roadmapStage === 'Practice').length },
          { stage: 'Project', desc: 'Build an end-to-end portfolio proof', count: resources.filter((r) => r.roadmapStage === 'Project').length },
          { stage: 'Ready', desc: 'Interview-ready verification checkoff', count: resources.filter((r) => r.roadmapStage === 'Ready').length },
        ],
      },
    };
  },

  // Applications
  getApplications: () => {
    const apps = getStoredCollection(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    return {
      success: true,
      data: { applications: apps },
    };
  },

  createApplication: (opportunityId, notes) => {
    const apps = getStoredCollection(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const user = getStoredCollection(STORAGE_KEYS.USER, DEMO_STUDENT);

    const targetOpp = opps.find((o) => o._id === opportunityId) || opps[0];
    const match = calculateMatchScore(user, targetOpp);

    const newApp = {
      _id: `app_${Date.now()}`,
      opportunity: targetOpp,
      student: user,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
      matchScore: match.overallScore,
      notes: notes || 'Applied via OpenPath one-click application.',
      timeline: [
        {
          status: 'Applied',
          timestamp: new Date().toISOString(),
          note: notes || 'Application submitted successfully with verified profile credentials.',
        },
      ],
      interviewDetails: null,
    };

    const updated = [newApp, ...apps];
    setStoredCollection(STORAGE_KEYS.APPLICATIONS, updated);

    return {
      success: true,
      data: { application: newApp },
    };
  },

  updateApplicationStatus: (applicationId, status, note, interviewDetails) => {
    const apps = getStoredCollection(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const updated = apps.map((app) => {
      if (app._id === applicationId) {
        const timeline = [
          ...(app.timeline || []),
          {
            status,
            timestamp: new Date().toISOString(),
            note: note || `Application advanced to status: ${status}`,
          },
        ];
        return {
          ...app,
          status,
          timeline,
          interviewDetails: interviewDetails || app.interviewDetails,
        };
      }
      return app;
    });

    setStoredCollection(STORAGE_KEYS.APPLICATIONS, updated);
    const found = updated.find((a) => a._id === applicationId);

    return {
      success: true,
      data: { application: found },
    };
  },

  // Student dashboard recommendations
  getRecommendedMatches: () => {
    const opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const user = getStoredCollection(STORAGE_KEYS.USER, DEMO_STUDENT);

    const scored = opps.map((o) => {
      const match = calculateMatchScore(user, o);
      return { ...o, matchScore: match.overallScore, matchDetails: match };
    });

    const bestMatches = [...scored].sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
    const basedOnSkills = scored.filter((o) => o.matchDetails?.factors?.skillMatch?.score >= 28).slice(0, 4);
    const basedOnInterests = scored.filter((o) => o.type === 'Internship' || o.type === 'Apprenticeship').slice(0, 4);

    return {
      success: true,
      data: {
        bestMatches,
        basedOnSkills: basedOnSkills.length ? basedOnSkills : scored.slice(0, 3),
        basedOnInterests: basedOnInterests.length ? basedOnInterests : scored.slice(1, 4),
      },
    };
  },

  // Dynamic Overview Platform Stats for Landing Page
  getOverviewStats: () => {
    const opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const apps = getStoredCollection(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const uniqueEmployers = new Set(opps.map((o) => o.organization || 'TechCorp Labs')).size;
    const uniqueStudents = new Set(apps.map((a) => a.student?.email || 'student')).size + 1;

    return {
      success: true,
      data: {
        totalOpportunities: opps.length,
        totalEmployers: Math.max(12, uniqueEmployers),
        totalStudents: Math.max(85, uniqueStudents * 15),
        totalSkills: INITIAL_SKILLS.length,
        totalApplications: apps.length,
      },
    };
  },

  // Employer Dashboard Stats & Applicants
  getEmployerStats: () => {
    const opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const apps = getStoredCollection(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);

    return {
      success: true,
      data: {
        stats: {
          activeListings: opps.filter((o) => o.status === 'Active').length,
          activeOpportunities: opps.filter((o) => o.status === 'Active').length,
          totalApplications: apps.length,
          totalApplicants: apps.length,
          shortlistedCount: apps.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview').length,
          shortlistedCandidates: apps.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview').length,
          interviewCount: apps.filter((a) => a.status === 'Interview' || a.interviewDetails).length,
          scheduledInterviews: apps.filter((a) => a.status === 'Interview' || a.interviewDetails).length,
        },
        recentApplications: apps.slice(0, 6),
      },
    };
  },

  // Employer Opportunities with Dynamic Applicant Count
  getEmployerOpportunities: () => {
    const opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const apps = getStoredCollection(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);

    const withApplicantCounts = opps.map((o) => {
      const matchingApps = apps.filter((a) => (a.opportunity?._id || a.opportunity) === o._id);
      return {
        ...o,
        applicantCount: matchingApps.length,
      };
    });

    return {
      success: true,
      data: {
        opportunities: withApplicantCounts,
        total: withApplicantCounts.length,
      },
    };
  },

  // Employer Candidates for Opportunity
  getEmployerOpportunityCandidates: (opportunityId) => {
    const opps = getStoredCollection(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const apps = getStoredCollection(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const targetOpp = opps.find((o) => o._id === opportunityId) || opps[0];

    const matchingApps = opportunityId
      ? apps.filter((a) => (a.opportunity?._id || a.opportunity) === opportunityId)
      : apps;

    const candidates = matchingApps.map((app) => {
      const student = app.student || DEMO_STUDENT;
      const match = calculateMatchScore(student, targetOpp);
      return {
        applicationId: app._id,
        user: student,
        matchScore: app.matchScore || match.overallScore,
        matchFactors: match.factors,
        status: app.status || 'Applied',
        appliedAt: app.appliedAt,
        notes: app.notes,
        timeline: app.timeline,
        interviewDetails: app.interviewDetails,
      };
    });

    return {
      success: true,
      data: {
        opportunity: targetOpp,
        candidates,
      },
    };
  },
};
