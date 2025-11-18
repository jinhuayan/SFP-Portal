import { createContext } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string[];
  token?: string;
  isAuthenticated?: boolean;
}

export const AuthContext = createContext<{
  currentUser: AuthUser | null;
  login: (user: Omit<AuthUser, 'isAuthenticated'>) => void;
  logout: () => void;
  isLoadingSession?: boolean;
}>({
  currentUser: null,
  login: () => {},
  logout: () => {},
  isLoadingSession: true,
});