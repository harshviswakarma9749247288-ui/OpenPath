import { create } from 'zustand';
import api from '../utils/api';

export const useApplicationStore = create((set, get) => ({
  applications: [],
  isLoading: false,
  error: null,
  activeFilter: 'all',

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  fetchMyApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/applications');
      set({ applications: res.data.applications, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  apply: async (opportunityId, notes = '') => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/applications', { opportunityId, notes });
      set((state) => ({
        applications: [res.data.application, ...state.applications],
        isLoading: false,
      }));
      return { success: true, application: res.data.application };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  updateStatus: async (applicationId, status, note = '', interviewDetails = null) => {
    try {
      const res = await api.patch(`/applications/${applicationId}/status`, {
        status,
        note,
        interviewDetails,
      });

      set((state) => ({
        applications: state.applications.map((app) =>
          app._id === applicationId ? res.data.application : app
        ),
      }));
      return { success: true, application: res.data.application };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
}));
