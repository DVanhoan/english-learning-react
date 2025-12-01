import type { SuccessResponse } from "./common.type";
import type { User } from "./user.type";

export interface SignIn {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshToken {
  accessToken: string;
  refreshToken: string;
}

export type SignInResponse = SuccessResponse<SignIn>;
export type RefreshTokenResponse = SuccessResponse<RefreshToken>;
export type SignUpResponse = SuccessResponse<User>;
