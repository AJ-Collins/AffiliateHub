import { create } from 'zustand';
import { authApi } from '../lib/api';
import type { LoginCredentials } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  login: async (credentials) => {
    const { token } = await authApi.login(credentials);
    localStorage.setItem('token', token);
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false });
  },
}));