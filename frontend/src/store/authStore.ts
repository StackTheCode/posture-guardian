import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  username: string | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (token: string, username: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      email: null,
      isAuthenticated: false,
      login: (token, username, email) => {
        localStorage.setItem('token', token);
        set({ token, username, email, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, username: null, email: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);