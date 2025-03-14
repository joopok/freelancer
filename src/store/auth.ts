import { create } from 'zustand';
import { SessionUser } from '@/types/auth';

interface AuthState {
  user: SessionUser | null;
  isLoggedIn: boolean;
  setUser: (user: SessionUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  logout: () => set({ user: null, isLoggedIn: false }),
})); 