import type { RefreshTokenResponse, SignInResponse } from "@/types/auth.type";
import http from "./http";
import { AUTH_PATH } from "./path";
import type {
  SuccessResponse,
  SuccessResponseNoData,
} from "@/types/common.type";
import {
  getAccessTokenLocalStorage,
  getRefreshTokenLocalStorage,
} from "@/utils/token";
import type { SignUpUserRequest, UserResponse } from "@/types/user.type";

export class AuthApi {
  static signIn = async (data: { email: string; password: string }) => {
    const response = await http.post<SignInResponse>(AUTH_PATH.SIGN_IN, data);
    return response.data;
  };

  static signOut = async () => {
    const response = await http.post<SuccessResponseNoData>(
      AUTH_PATH.SIGN_OUT,
      null,
      {
        headers: {
          "X-Token": getAccessTokenLocalStorage(),
          "Y-Token": getRefreshTokenLocalStorage(),
        },
      }
    );
    return response.data;
  };

  static refreshToken = async () => {
    const response = await http.post<RefreshTokenResponse>(
      AUTH_PATH.REFRESH_TOKEN,
      null,
      {
        headers: {
          "Y-Token": getRefreshTokenLocalStorage(),
        },
      }
    );
    return response.data;
  };

  static authenticateGoogle = async (code: string) => {
    const response = await http.post<SignInResponse>(
      AUTH_PATH.AUTHENTICATE_GOOGLE,
      null,
      { headers: { "G-Code": code } }
    );
    return response.data;
  };

  static signUp = async (user: SignUpUserRequest) => {
    const response = await http.post<UserResponse>(AUTH_PATH.SIGN_UP, user);
    return response.data;
  };

  static checkNoPassword = async (email: string) => {
    const response = await http.get<SuccessResponse<boolean>>(
      `${AUTH_PATH.CHECK_NO_PASSWORD}/${email}`
    );
    return response.data;
  };

  static createPassword = async (email: string, password: string) => {
    const response = await http.post<SuccessResponseNoData>(
      AUTH_PATH.CREATE_PASSWORD,
      { email, password }
    );
    return response.data;
  };

  static verifyEmail = async (token: string) => {
    const response = await http.post<SuccessResponseNoData>(
      AUTH_PATH.VERIFY_EMAIL,
      null,
      {
        headers: { "C-Token": token },
      }
    );
    return response.data;
  };

  static forgotPassword = async (email: string) => {
    const response = await http.post<SuccessResponseNoData>(
      AUTH_PATH.FORGOT_PASSWORD,
      { email }
    );
    return response.data;
  };

  static resetPassword = async (token: string, newPassword: string) => {
    const response = await http.post<SuccessResponseNoData>(
      AUTH_PATH.RESET_PASSWORD,
      { newPassword },
      {
        headers: { "R-Token": token },
      }
    );
    return response.data;
  };
}
