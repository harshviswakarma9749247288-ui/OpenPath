import { create } from 'zustand';
import api from '../utils/api';

let latestFetchId = 0;

export const useOpportunityStore = create((set, get) => ({
  opportunities: [],
  allOpportunities: [],
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

  // Fetch opportunities with active filters (live search compatible)
  fetchOpportunities: async (customParams = {}) => {
    const reqId = ++latestFetchId;
    set({ isLoading: true, error: null });
    try {
      const state = get();
      const params = new URLSearchParams();

      const activeSearch =
        customParams.search !== undefined ? customParams.search : state.searchQuery;
      if (activeSearch && activeSearch.trim()) {
        params.append('search', activeSearch.trim());
      }

      const activeType = customParams.type !== undefined ? customParams.type : state.selectedType;
      if (activeType && activeType !== 'all') {
        params.append('type', activeType);
      }

      const activeLocation =
        customParams.locationType !== undefined
          ? customParams.locationType
          : state.selectedLocation;
      if (activeLocation && activeLocation !== 'all') {
        params.append('locationType', activeLocation);
      }

      const activeSort = customParams.sortBy !== undefined ? customParams.sortBy : state.selectedSort;
      if (activeSort) {
        params.append('sortBy', activeSort);
      }

      const res = await api.get(`/opportunities?${params.toString()}`);
      if (reqId === latestFetchId) {
        const fetched = res?.data?.opportunities || [];
        const isUnfiltered =
          (!activeSearch || !activeSearch.trim()) &&
          (!activeType || activeType === 'all') &&
          (!activeLocation || activeLocation === 'all');

        set((prev) => ({
          opportunities: fetched,
          allOpportunities: isUnfiltered
            ? fetched
            : prev.allOpportunities.length > 0
            ? prev.allOpportunities
            : fetched,
          isLoading: false,
        }));
      }
    } catch (err) {
      if (reqId === latestFetchId) {
        set({ isLoading: false, error: err.message });
      }
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

  // Save / Bookmark toggle synced with database
  toggleSaveOpportunity: async (id) => {
    const current = get().savedIds;
    let updated;
    if (current.includes(id)) {
      updated = current.filter((item) => item !== id);
    } else {
      updated = [...current, id];
    }
    localStorage.setItem('openpath_saved_opps', JSON.stringify(updated));
    set({ savedIds: updated });

    if (localStorage.getItem('openpath_token')) {
      try {
        const res = await api.post(`/users/me/saved-opportunities/${id}`);
        if (Array.isArray(res?.data?.savedOpportunities)) {
          localStorage.setItem(
            'openpath_saved_opps',
            JSON.stringify(res.data.savedOpportunities)
          );
          set({ savedIds: res.data.savedOpportunities });
        }
      } catch (err) {
        // Keep optimistic local update if request fails
      }
    }
  },
}));
