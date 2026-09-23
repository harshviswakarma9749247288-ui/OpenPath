import { create } from 'zustand';
import api from '../utils/api';

export const useOpportunityStore = create((set, get) => ({
  opportunities: [],
  selectedOpportunity: null,
  matchExplanation: null,
  skillGap: null,
  learningRecommendations: [],
  isLoading: false,
  error: null,
  savedIds: JSON.parse(localStorage.getItem('openpath_saved_opps') || '[]'),
  searchQuery: '',
  selectedType: 'all',
  selectedLocation: 'all',
  selectedSort: 'latest',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedType: (type) => set({ selectedType: type }),
  setSelectedLocation: (loc) => set({ selectedLocation: loc }),
  setSelectedSort: (sort) => set({ selectedSort: sort }),

  // Fetch opportunities with active filters
  fetchOpportunities: async (customParams = {}) => {
    set({ isLoading: true, error: null });
    try {
      const state = get();
      const params = new URLSearchParams();
      if (customParams.search !== undefined ? customParams.search : state.searchQuery) {
        params.append('search', customParams.search || state.searchQuery);
      }
      if ((customParams.type || state.selectedType) !== 'all') {
        params.append('type', customParams.type || state.selectedType);
      }
      if ((customParams.locationType || state.selectedLocation) !== 'all') {
        params.append('locationType', customParams.locationType || state.selectedLocation);
      }
      if (customParams.sortBy || state.selectedSort) {
        params.append('sortBy', customParams.sortBy || state.selectedSort);
      }

      const res = await api.get(`/opportunities?${params.toString()}`);
      set({ opportunities: res.data.opportunities, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  // Fetch single opportunity by ID
  fetchOpportunityById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/opportunities/${id}`);
      set({ selectedOpportunity: res.data.opportunity, isLoading: false });
      return res.data.opportunity;
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return null;
    }
  },

  // Fetch 5-factor match explanation
  fetchMatchExplanation: async (id) => {
    try {
      const res = await api.get(`/opportunities/${id}/match`);
      set({ matchExplanation: res.data.match });
      return res.data.match;
    } catch (err) {
      console.error('Error fetching match explanation:', err.message);
      return null;
    }
  },

  // Fetch Skill Gap breakdown
  fetchSkillGap: async (id) => {
    try {
      const res = await api.get(`/opportunities/${id}/skill-gap`);
      set({ skillGap: res.data.skillGap });
      return res.data.skillGap;
    } catch (err) {
      console.error('Error fetching skill gap:', err.message);
      return null;
    }
  },

  // Fetch Learning recommendations for gaps
  fetchLearningForOpportunity: async (id) => {
    try {
      const res = await api.get(`/learning/recommendations?opportunityId=${id}`);
      set({ learningRecommendations: res.data.resources || [] });
      return res.data;
    } catch (err) {
      console.error('Error fetching learning recommendations:', err.message);
      return null;
    }
  },

  // Save / Bookmark toggle
  toggleSaveOpportunity: (id) => {
    const current = get().savedIds;
    let updated;
    if (current.includes(id)) {
      updated = current.filter((item) => item !== id);
    } else {
      updated = [...current, id];
    }
    localStorage.setItem('openpath_saved_opps', JSON.stringify(updated));
    set({ savedIds: updated });
  },
}));
