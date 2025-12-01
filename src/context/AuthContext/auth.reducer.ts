import { AuthAction, type AuthPayloadAction } from "./auth.action";
import type { AuthState } from "./auth.state";

export const authReducer = (state: AuthState, action: AuthPayloadAction) => {
  switch (action.type) {
    case AuthAction.SIGN_IN:
      return { ...state, isAuthenticated: true, user: action.payload.user };
    case AuthAction.SIGN_OUT:
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
};
