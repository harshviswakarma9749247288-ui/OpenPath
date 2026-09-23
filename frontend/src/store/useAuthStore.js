import { create } from 'zustand';
import api from '../utils/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('openpath_token') || null,
  isAuthenticated: !!localStorage.getItem('openpath_token'),
  isLoading: false,
  error: null,
  profileCompletion: {
    percentage: 0,
    missingFields: [],
    isComplete: false,
  },

  // Initialize auth state by fetching current user if token exists
  initAuth: async () => {
    const token = localStorage.getItem('openpath_token');
    if (!token) return;
    try {
      set({ isLoading: true });
      const res = await api.get('/users/me');
      set({
        user: res.data.user,
        profileCompletion: res.data.profileCompletion,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      localStorage.removeItem('openpath_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;
      if (token) {
        localStorage.setItem('openpath_token', token);
      }
      set({ user, token, isAuthenticated: true, isLoading: false });
      // Fetch fresh profile completion metrics
      get().initAuth();
      return { success: true, user };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  // One-click demo login for fast hackathon evaluation
  demoLogin: async (role = 'student') => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/demo-login', { role });
      const { user, token } = res.data;
      if (token) {
        localStorage.setItem('openpath_token', token);
      }
      set({ user, token, isAuthenticated: true, isLoading: false });
      get().initAuth();
      return { success: true, user };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Register
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', userData);
      const { user, token } = res.data;
      if (token) {
        localStorage.setItem('openpath_token', token);
      }
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true, user };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Update Profile
  updateProfile: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put('/users/me', payload);
      set({
        user: res.data.user,
        profileCompletion: res.data.profileCompletion,
        isLoading: false,
      });
      return { success: true, user: res.data.user };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore
    }
    localStorage.removeItem('openpath_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      profileCompletion: { percentage: 0, missingFields: [], isComplete: false },
    });
  },
}));
