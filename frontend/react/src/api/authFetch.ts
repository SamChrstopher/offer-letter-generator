import { refreshApi } from "../api/auth";

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

let sessionExpiredHandled = false;

const handleSessionExpired = () => {
  if (sessionExpiredHandled) return;
  sessionExpiredHandled = true;

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  window.dispatchEvent(new Event("session-expired"));

  setTimeout(() => {
    window.location.href = "/login";
  }, 500);
};

export const authFetch = async (url: string, options: RequestInit = {}) => {
  let accessToken = localStorage.getItem("access_token");

  const makeRequest = async (token: string) => {
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  };

  if (!accessToken) {
    handleSessionExpired();
    throw new Error("Session expired");
  }

  let res = await makeRequest(accessToken);

  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      handleSessionExpired();
      throw new Error("Session expired");
    }

    try {
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = refreshApi(refreshToken)
          .then((newTokens) => {
            localStorage.setItem("access_token", newTokens.access_token);
            localStorage.setItem("refresh_token", newTokens.refresh_token);
            return newTokens;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      const newTokens = await refreshPromise;

      res = await makeRequest(newTokens.access_token);

      if (res.status === 401) {
        handleSessionExpired();
        throw new Error("Session expired");
      }

      return res;
    } catch {
      handleSessionExpired();
      throw new Error("Session expired");
    }
  }

  return res;
};
