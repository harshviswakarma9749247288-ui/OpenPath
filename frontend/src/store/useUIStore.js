import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isSidebarCollapsed: localStorage.getItem('openpath_sidebar_collapsed') === 'true',
  isMobileDrawerOpen: false,
  activePage: 'landing', // landing, login, register, profile-setup, dashboard, opportunities, details, match, skill-gap, learning, applications, profile, employer-dashboard, create-opportunity, manage-opportunities, candidate-review
  pageParams: {},
  toast: null,

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

  navigate: (page, params = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    set((state) => {
      // Don't add duplicate of current page to history
      const newHistory =
        state.activePage === page
          ? state.history
          : [...state.history, { page: state.activePage, params: state.pageParams }];
      return {
        history: newHistory,
        activePage: page,
        pageParams: params,
        isMobileDrawerOpen: false,
      };
    });
  },

  goBack: (fallbackPage = 'dashboard', fallbackParams = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    set((state) => {
      if (state.history && state.history.length > 0) {
        const prev = state.history[state.history.length - 1];
        const newHistory = state.history.slice(0, -1);
        return {
          history: newHistory,
          activePage: prev.page,
          pageParams: prev.params || {},
          isMobileDrawerOpen: false,
        };
      }
      return {
        activePage: fallbackPage,
        pageParams: fallbackParams,
        isMobileDrawerOpen: false,
      };
    });
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type, id: Date.now() } });
    setTimeout(() => {
      set({ toast: null });
    }, 4000);
  },

  clearToast: () => set({ toast: null }),
}));
