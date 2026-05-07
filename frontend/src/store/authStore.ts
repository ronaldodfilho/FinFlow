import { create } from 'zustand';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const storedToken = localStorage.getItem('@FinFlow:token');
  const storedUser = localStorage.getItem('@FinFlow:user');

  return {
    token: storedToken,
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedToken,
    login: (token: string, user: User) => {
      localStorage.setItem('@FinFlow:token', token);
      localStorage.setItem('@FinFlow:user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('@FinFlow:token');
      localStorage.removeItem('@FinFlow:user');
      set({ token: null, user: null, isAuthenticated: false });
    },
  };
});
