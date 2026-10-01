import { MockServer } from './mockApi.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Route dispatcher for mock fallback engine
function handleMockRoute(method, endpoint, body) {
  const [pathname, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');

  // 1. Stats Overview
  if (pathname === '/stats/overview') {
    return MockServer.getStatsOverview();
  }

  // 2. Auth Routes
  if (pathname === '/auth/demo-login') {
    return MockServer.demoLogin(body?.role || 'student');
  }
  if (pathname === '/auth/login') {
    return MockServer.login(body?.email, body?.password);
  }
  if (pathname === '/auth/register') {
    return MockServer.register(body);
  }
  if (pathname === '/auth/otp/send') {
    return { success: true, message: 'OTP sent successfully to your email.' };
  }
  if (pathname === '/auth/otp/verify' || pathname === '/auth/otp/login') {
    return MockServer.login(body?.email || 'alex.rivera@university.edu');
  }
  if (pathname === '/auth/password/forgot') {
    return { success: true, message: 'Password recovery OTP sent to email.' };
  }
  if (pathname === '/auth/password/reset') {
    return { success: true, message: 'Password successfully updated.' };
  }
  if (pathname === '/auth/logout') {
    return MockServer.logout();
  }

  // 3. User Routes
  if (pathname === '/users/me') {
    if (method === 'PUT') {
      return MockServer.updateProfile(body);
    }
    return MockServer.getCurrentUser();
  }

  // 4. Opportunities Matches & Gaps (Check specific sub-routes first!)
  const matchMatch = pathname.match(/^\/opportunities\/([^\/]+)\/match$/);
  if (matchMatch) {
    return MockServer.getMatchExplanation(matchMatch[1]);
  }

  const skillGapMatch = pathname.match(/^\/opportunities\/([^\/]+)\/skill-gap$/);
  if (skillGapMatch) {
    return MockServer.getSkillGap(skillGapMatch[1]);
  }

  // 5. Opportunities CRUD
  const singleOppMatch = pathname.match(/^\/opportunities\/([^\/]+)$/);
  if (singleOppMatch) {
    const oppId = singleOppMatch[1];
    if (method === 'PUT') return MockServer.updateOpportunity(oppId, body);
    if (method === 'DELETE') return MockServer.deleteOpportunity(oppId);
    return MockServer.getOpportunityById(oppId);
  }

  if (pathname === '/opportunities') {
    if (method === 'POST') {
      return MockServer.createOpportunity(body);
    }
    return MockServer.getOpportunities(
      params.get('search') || '',
      params.get('type') || 'all',
      params.get('locationType') || 'all',
      params.get('sortBy') || 'latest',
      params.get('limit')
    );
  }

  // 6. Learning Recommendations
  if (pathname.startsWith('/learning')) {
    return MockServer.getLearningRecommendations(
      params.get('opportunityId'),
      params.get('skillName')
    );
  }

  // 7. Applications
  const appStatusMatch = pathname.match(/^\/applications\/([^\/]+)\/status$/);
  if (appStatusMatch) {
    return MockServer.updateApplicationStatus(
      appStatusMatch[1],
      body?.status,
      body?.note,
      body?.interviewDetails
    );
  }

  if (pathname === '/applications') {
    if (method === 'POST') {
      return MockServer.createApplication(body?.opportunityId, body?.notes);
    }
    return MockServer.getApplications();
  }

  // 8. Recommended matches for Student Dashboard
  if (pathname === '/matches/recommended') {
    return MockServer.getRecommendedMatches();
  }

  // 9. Employer Dashboard & Routes
  const empCandidateMatch = pathname.match(/^\/employer\/opportunities\/([^\/]+)\/candidates$/);
  if (empCandidateMatch) {
    return MockServer.getEmployerOpportunityCandidates(empCandidateMatch[1]);
  }

  if (pathname === '/employer/opportunities') {
    return MockServer.getEmployerOpportunities();
  }

  if (pathname === '/employer/dashboard-stats') {
    return MockServer.getEmployerStats();
  }

  // 10. Platform Overview Stats
  if (pathname === '/stats/overview') {
    return MockServer.getOverviewStats();
  }

  // 11. Notifications
  if (pathname.includes('/notifications')) {
    return { success: true, message: 'All notifications marked as read' };
  }

  // Fallback for any unknown route
  console.warn(`[Mock Fallback] Unhandled route: ${method} ${endpoint}`);
  return { success: true, data: {} };
}

export const request = async (endpoint, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const token = localStorage.getItem('openpath_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
    credentials: 'include',
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  // Try live backend first; if it fails or backend is offline, immediately fallback to MockServer
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800); // 1.8s timeout for instant responsiveness

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...config,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return data;
    }
    // If backend returns 404 or 500 error, switch to mock handler
    console.info(`Backend responded with ${res.status}. Falling back to client-side mock engine.`);
    return handleMockRoute(method, endpoint, options.body);
  } catch (error) {
    // Backend unreachable, timeout, or CORS issue -> Seamless mock fallback
    return handleMockRoute(method, endpoint, options.body);
  }
};

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
