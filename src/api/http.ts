import { AUTH_PATH } from "./path";
import { AuthApi } from "./auth.api";
import { signOut } from "@/context/AuthContext/auth.action";
import { externalDispatch } from "@/context/AuthContext/auth.context";
import type { ErrorResponse } from "@/types/common.type";
import {
  getAccessTokenLocalStorage,
  getRefreshTokenLocalStorage,
  removeTokenLocalStorage,
  setAccessTokenLocalStorage,
  setRefreshTokenLocalStorage,
} from "@/utils/token";
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";

class Http {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;
  private refreshPromise: Promise<string> | null;
  private refreshFailed: boolean;

  constructor() {
    this.accessToken = getAccessTokenLocalStorage();
    this.refreshToken = getRefreshTokenLocalStorage();
    this.refreshPromise = null;
    this.refreshFailed = false;

    this.instance = axios.create({
      baseURL: import.meta.env.API_URL || "http://localhost:8080/e-learning",
      timeout: 1000 * 60 * 15,
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "vi",
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => {
        if (
          response.config.url === AUTH_PATH.SIGN_IN ||
          response.config.url === AUTH_PATH.AUTHENTICATE_GOOGLE
        ) {
          if (!response.data.data.user.noPassword) {
            this.accessToken = response.data.data.accessToken;
            this.refreshToken = response.data.data.refreshToken;
            setAccessTokenLocalStorage(this.accessToken);
            setRefreshTokenLocalStorage(this.refreshToken);
            this.refreshFailed = false;
          }
        }

        if (response.config.url === AUTH_PATH.SIGN_OUT) {
          this.accessToken = "";
          this.refreshToken = "";
          removeTokenLocalStorage();
          this.refreshFailed = false;
        }

        return response;
      },
      async (error: AxiosError<ErrorResponse>) => {
        if (!error.response) {
          return Promise.reject(error);
        }

        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (originalRequest.url === AUTH_PATH.SIGN_OUT) {
          removeTokenLocalStorage();
          this.accessToken = "";
          this.refreshToken = "";
        }

        if (
          error.response?.data.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          originalRequest.url !== AUTH_PATH.SIGN_OUT &&
          originalRequest.url !== AUTH_PATH.REFRESH_TOKEN &&
          originalRequest.url !== AUTH_PATH.SIGN_IN &&
          originalRequest.url !== AUTH_PATH.RESET_PASSWORD
        ) {
          if (this.refreshFailed) {
            removeTokenLocalStorage();
            this.accessToken = "";
            this.refreshToken = "";
            externalDispatch(signOut());
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          if (!this.refreshPromise) {
            this.refreshPromise = (async () => {
              try {
                const response = await AuthApi.refreshToken();
                const newAccessToken = response.data.accessToken;
                const newRefreshToken = response.data.refreshToken;
                this.accessToken = newAccessToken;
                this.refreshToken = newRefreshToken;
                setAccessTokenLocalStorage(this.accessToken);
                setRefreshTokenLocalStorage(this.refreshToken);
                return newAccessToken;
              } catch (err) {
                this.refreshFailed = true;
                removeTokenLocalStorage();
                this.accessToken = "";
                this.refreshToken = "";
                externalDispatch(signOut());
                toast.error("Phiên đăng nhập hết hạn");
                throw err;
              } finally {
                this.refreshPromise = null;
              }
            })();
          }

          try {
            const token = await this.refreshPromise;
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return this.instance(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;
export default http;
