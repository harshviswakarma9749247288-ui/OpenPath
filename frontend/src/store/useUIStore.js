import { create } from 'zustand';

export const VALID_PAGES = [
  'landing',
  'login',
  'register',
  'profile-setup',
  'dashboard',
  'opportunities',
  'details',
  'match',
  'skill-gap',
  'learning',
  'applications',
  'profile',
  'employer-dashboard',
  'create-opportunity',
  'manage-opportunities',
  'candidate-review',
];

// Converts page + params to a clean web URL path
export function routeToUrl(page, params = {}) {
  // If page is empty, invalid, or corrupted with template brackets, fall back to root '/'
  if (!page || page === 'landing' || page.includes('{') || page.includes('(')) {
    return '/';
  }

  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.set(key, String(val));
    }
  });

  const qStr = query.toString();
  return '/' + page + (qStr ? '?' + qStr : '');
}

// Parses window.location into { page, params }
export function parseLocationToRoute() {
  if (typeof window === 'undefined') {
    return { page: 'landing', params: {} };
  }

  try {
    let path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    let queryString = window.location.search.replace(/^\?/, '');

    // Corrupted URL detector: if path contains URL-encoded or raw template strings
    if (
      !path ||
      path === 'index.html' ||
      path === 'landing' ||
      path.includes('{') ||
      path.includes('%7B') ||
      path.includes('(')
    ) {
      return { page: 'landing', params: {} };
    }

    // Support hash fallback
    if (window.location.hash) {
      let hash = window.location.hash.slice(1).replace(/^\/+/, '');
      if (hash) {
        const parts = hash.split('?');
        path = parts[0] || '';
        queryString = parts[1] || queryString;
      }
    }

    const params = {};
    if (queryString) {
      const sp = new URLSearchParams(queryString);
      sp.forEach((val, key) => {
        params[key] = val;
      });
    }

    const matchedPage = VALID_PAGES.includes(path) ? path : 'landing';
    return { page: matchedPage, params };
  } catch (e) {
    return { page: 'landing', params: {} };
  }
}

const initialRoute = parseLocationToRoute();

export const useUIStore = create((set, get) => ({
  isSidebarCollapsed: localStorage.getItem('openpath_sidebar_collapsed') === 'true',
  isMobileDrawerOpen: false,
  activePage: initialRoute.page,
  pageParams: initialRoute.params,
  toast: null,

  // --- AI Career Mentor Drawer Global State ---
  isAiDrawerOpen: false,
  activeMentorOpportunity: null,

  setAiDrawerOpen: (isOpen) => set({ isAiDrawerOpen: isOpen }),

  openMentorForOpportunity: (opportunity) =>
    set({
      activeMentorOpportunity: opportunity,
      isAiDrawerOpen: true,
    }),

  clearMentorOpportunity: () =>
    set({
      activeMentorOpportunity: null,
    }),
  // ---------------------------------------------

  theme: localStorage.getItem('openpath_theme') || 'dark',

  toggleTheme: () => {
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('openpath_theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return { theme: next };
    });
  },

  setTheme: (theme) => {
    localStorage.setItem('openpath_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  toggleSidebar: () => {
    set((state) => {
      const next = !state.isSidebarCollapsed;
      localStorage.setItem('openpath_sidebar_collapsed', next.toString());
      return { isSidebarCollapsed: next };
    });
  },

  setMobileDrawerOpen: (isOpen) => set({ isMobileDrawerOpen: isOpen }),

  history: [],

  navigate: (page, params = {}, options = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const targetPage = VALID_PAGES.includes(page) ? page : 'landing';
    const targetParams = params || {};
    const newUrl = routeToUrl(targetPage, targetParams);
    const currentUrl = window.location.pathname + window.location.search;

    if (typeof window !== 'undefined' && currentUrl !== newUrl) {
      if (options?.replace) {
        window.history.replaceState({ page: targetPage, params: targetParams }, '', newUrl);
      } else {
        window.history.pushState({ page: targetPage, params: targetParams }, '', newUrl);
      }
    }

    set((state) => {
      const newHistory =
        state.activePage === targetPage
          ? state.history
          : [...state.history, { page: state.activePage, params: state.pageParams }];
      return {
        history: newHistory,
        activePage: targetPage,
        pageParams: targetParams,
        isMobileDrawerOpen: false,
      };
    });
  },

  goBack: (fallbackPage = 'dashboard', fallbackParams = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }

    const state = get();
    if (state.history && state.history.length > 0) {
      const prev = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      const newUrl = routeToUrl(prev.page, prev.params || {});
      if (typeof window !== 'undefined') {
        window.history.pushState({ page: prev.page, params: prev.params || {} }, '', newUrl);
      }
      set({
        history: newHistory,
        activePage: prev.page,
        pageParams: prev.params || {},
        isMobileDrawerOpen: false,
      });
      return;
    }

    get().navigate(fallbackPage, fallbackParams);
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type, id: Date.now() } });
    setTimeout(() => {
      set({ toast: null });
    }, 4000);
  },

  clearToast: () => set({ toast: null }),
}));

// Browser Sync Listeners
if (typeof window !== 'undefined') {
  const initialUrl = routeToUrl(initialRoute.page, initialRoute.params);
  window.history.replaceState(
    { page: initialRoute.page, params: initialRoute.params },
    '',
    initialUrl
  );

  window.addEventListener('popstate', (e) => {
    let targetPage;
    let targetParams;

    if (e.state && e.state.page) {
      targetPage = e.state.page;
      targetParams = e.state.params || {};
    } else {
      const parsed = parseLocationToRoute();
      targetPage = parsed.page;
      targetParams = parsed.params;
    }

    useUIStore.setState({
      activePage: targetPage,
      pageParams: targetParams,
      isMobileDrawerOpen: false,
    });
  });

  window.addEventListener('hashchange', () => {
    if (window.location.hash) {
      const parsed = parseLocationToRoute();
      const cleanUrl = routeToUrl(parsed.page, parsed.params);
      window.history.replaceState({ page: parsed.page, params: parsed.params }, '', cleanUrl);
      useUIStore.setState({
        activePage: parsed.page,
        pageParams: parsed.params,
        isMobileDrawerOpen: false,
      });
    }
  });
}