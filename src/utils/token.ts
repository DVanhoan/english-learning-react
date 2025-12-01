export const getAccessTokenLocalStorage = () => {
  return localStorage.getItem("access_token") || "";
};

export const setAccessTokenLocalStorage = (accessToken: string) => {
  localStorage.setItem("access_token", accessToken);
};

export const getRefreshTokenLocalStorage = () => {
  return localStorage.getItem("refresh_token") || "";
};

export const setRefreshTokenLocalStorage = (refreshToken: string) => {
  localStorage.setItem("refresh_token", refreshToken);
};

export const removeTokenLocalStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
