import type { User } from "@/types/user.type";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export const initAuthState: AuthState = {
  isAuthenticated: null,
  user: null,
};
