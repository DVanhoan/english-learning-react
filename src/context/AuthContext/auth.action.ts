import type { AuthState } from "./auth.state";

export const AuthAction = {
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

export interface AuthPayloadAction {
  type: string;
  payload: AuthState;
}

export const signIn = (payload: AuthState): AuthPayloadAction => {
  return {
    type: AuthAction.SIGN_IN,
    payload,
  };
};

export const signOut = (): AuthPayloadAction => {
  return {
    type: AuthAction.SIGN_OUT,
    payload: {
      isAuthenticated: false,
      user: null,
    },
  };
};
