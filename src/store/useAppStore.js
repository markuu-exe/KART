import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Auth state
  user: null,
  isLoading: false,
  error: null,

  // User actions
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Clear auth
  logout: () => set({ user: null, error: null }),
}));