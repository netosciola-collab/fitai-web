import { create } from 'zustand';
import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  initialized: boolean;
  error: string | null;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  initialized: false,
  error: null,

  signIn: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/v1/auth/login', { email });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, isLoading: false });
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      const errorMessage = error.response?.data?.error || 'Falha ao fazer login';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  signUp: async (email: string, name?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/v1/auth/register', { 
        email, 
        name: name || email.split('@')[0] 
      });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, isLoading: false });
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      const errorMessage = error.response?.data?.error || 'Falha ao criar conta';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await api.post('/v1/auth/logout');
      localStorage.removeItem('auth_token');
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      set({ isLoading: false });
    }
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      // Try to get user from backend with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await api.get('/v1/auth/me', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      set({ user: response.data.user, isLoading: false, initialized: true });
    } catch (error: any) {
      // User not authenticated or request failed
      if (error.name !== 'AbortError') {
        console.log('Auth initialization failed:', error.message);
      }
      localStorage.removeItem('auth_token');
      set({ user: null, isLoading: false, initialized: true });
    }
  },

  setUser: (user: User | null) => {
    set({ user });
  },

  setInitialized: (initialized: boolean) => {
    set({ initialized });
  },
}));
