import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isSidebarCollapsed: localStorage.getItem('openpath_sidebar_collapsed') === 'true',
  isMobileDrawerOpen: false,
  activePage: 'landing', // landing, login, register, profile-setup, dashboard, opportunities, details, match, skill-gap, learning, applications, profile, employer-dashboard, create-opportunity, manage-opportunities, candidate-review
  pageParams: {},
  toast: null,

  toggleSidebar: () => {
    set((state) => {
      const next = !state.isSidebarCollapsed;
      localStorage.setItem('openpath_sidebar_collapsed', next.toString());
      return { isSidebarCollapsed: next };
    });
  },

  setMobileDrawerOpen: (isOpen) => set({ isMobileDrawerOpen: isOpen }),

  navigate: (page, params = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    set({
      activePage: page,
      pageParams: params,
      isMobileDrawerOpen: false,
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
