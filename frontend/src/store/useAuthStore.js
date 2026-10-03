import { create } from 'zustand';
import api from '../utils/api';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('openpath_user') || localStorage.getItem('openpath_mock_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const getStoredCompletion = () => {
  try {
    const raw = localStorage.getItem('openpath_profile_completion');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const initialUser = getStoredUser();
const initialToken = localStorage.getItem('openpath_token') || null;

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  isLoading: false,
  error: null,
  profileCompletion: getStoredCompletion() || {
    percentage: initialUser?.skills?.length ? 80 : 0,
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
      const userData = res?.data?.user || res?.user || res?.data;
      const profileCompletion = res?.data?.profileCompletion || res?.profileCompletion;
      if (userData && (userData._id || userData.email || userData.name)) {
        try {
          localStorage.setItem('openpath_user', JSON.stringify(userData));
          if (profileCompletion) {
            localStorage.setItem('openpath_profile_completion', JSON.stringify(profileCompletion));
          }
        } catch (e) {}
        set({
          user: userData,
          profileCompletion: profileCompletion || get().profileCompletion,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      // If error is 401 or 403, session has truly expired
      const isAuthError =
        err?.status === 401 ||
        err?.status === 403 ||
        err?.message?.includes('401') ||
        err?.message?.includes('token expired');
      if (isAuthError) {
        localStorage.removeItem('openpath_token');
        localStorage.removeItem('openpath_user');
        localStorage.removeItem('openpath_profile_completion');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      } else {
        // Keep cached offline/demo user, just stop loading
        set({ isLoading: false });
      }
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const userData = res?.data?.user || res?.user;
      const token = res?.data?.token || res?.token;
      if (token) {
        localStorage.setItem('openpath_token', token);
      }
      if (userData) {
        localStorage.setItem('openpath_user', JSON.stringify(userData));
      }
      set({ user: userData, token, isAuthenticated: true, isLoading: false });
      get().initAuth();
      return { success: true, user: userData };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Login with OTP
  loginWithOtp: async (email, code) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/otp/login', { email, code });
      const userData = res?.data?.user || res?.user;
      const token = res?.data?.token || res?.token;
      if (token) {
        localStorage.setItem('openpath_token', token);
      }
      if (userData) {
        localStorage.setItem('openpath_user', JSON.stringify(userData));
      }
      set({ user: userData, token, isAuthenticated: true, isLoading: false });
      get().initAuth();
      return { success: true, user: userData };
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
      const userData = res?.data?.user || res?.user;
      const token = res?.data?.token || res?.token;
      const profileCompletion = res?.data?.profileCompletion || res?.profileCompletion;
      if (token) {
        localStorage.setItem('openpath_token', token);
      }
      if (userData) {
        localStorage.setItem('openpath_user', JSON.stringify(userData));
      }
      if (profileCompletion) {
        localStorage.setItem('openpath_profile_completion', JSON.stringify(profileCompletion));
      }
      set({
        user: userData,
        token,
        isAuthenticated: true,
        isLoading: false,
        profileCompletion: profileCompletion || get().profileCompletion,
      });
      return { success: true, user: userData };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Register
  register: async (userDataPayload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', userDataPayload);
      const userData = res?.data?.user || res?.user;
      const token = res?.data?.token || res?.token;
      if (token) {
        localStorage.setItem('openpath_token', token);
      }
      if (userData) {
        localStorage.setItem('openpath_user', JSON.stringify(userData));
      }
      set({ user: userData, token, isAuthenticated: true, isLoading: false });
      return { success: true, user: userData };
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
      const userData = res?.data?.user || res?.user;
      const profileCompletion = res?.data?.profileCompletion || res?.profileCompletion;
      if (userData) {
        localStorage.setItem('openpath_user', JSON.stringify(userData));
      }
      if (profileCompletion) {
        localStorage.setItem('openpath_profile_completion', JSON.stringify(profileCompletion));
      }
      set({
        user: userData,
        profileCompletion: profileCompletion || get().profileCompletion,
        isLoading: false,
      });
      return { success: true, user: userData };
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
    localStorage.removeItem('openpath_user');
    localStorage.removeItem('openpath_profile_completion');
    sessionStorage.removeItem('openpath_active_route');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      profileCompletion: { percentage: 0, missingFields: [], isComplete: false },
    });
  },
}));
