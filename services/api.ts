
import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Async secure storage wrapper
const storage = {
  get: async (key: string) => await SecureStore.getItemAsync(key),
  set: async (key: string, value: string) =>
    await SecureStore.setItemAsync(key, value),
  remove: async (key: string) => await SecureStore.deleteItemAsync(key),
};

// Session-like variable (RN has no sessionStorage)
let rideFlowFlag = false;

// Base URL
const baseURL = __DEV__ ? `${process.env?.EXPO_PUBLIC_API_BASE_URL}/api` : process.env?.EXPO_PUBLIC_API_BASE_URL;

if (!baseURL) {
  console.warn("[API] EXPO_PUBLIC_API_BASE_URL is not defined!");
}

const api = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 120000,
});

api.interceptors.request.use(async (config) => {
  try {
    const publicEndpoints = [
      "/users/send-otp",
      "/users/verify-otp",
      "/users/complete-signup",
      "/bookings/calculate-fare",
      "/bookings/public-status",
      "/bookings/geocode",
      "/bookings/reverse-geocode",
      "/bookings/book",
    ];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (!isPublicEndpoint) {
      const token = await storage.get("token");
      const alreadyAuth =
        config.headers && (config.headers as any).Authorization;

      if (token && !alreadyAuth) {
        config.headers = config.headers || {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }

    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    if (isFormData) {
      if (config.headers && "Content-Type" in config.headers) {
        delete (config.headers as any)["Content-Type"];
      }
    } else {
      (config.headers as any)["Content-Type"] =
        (config.headers as any)["Content-Type"] || "application/json";
    }
  } catch (err) { }

  return config;
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let lastRefreshAttempt = 0;
const REFRESH_COOLDOWN_MS = 5000;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const cfg = error?.config || {};
      const url = cfg?.url || "";

      const isRefreshEndpoint =
        url.includes("/users/refresh") ||
        url.includes("/auth/refresh") ||
        url.includes("/rider/refresh") ||
        url.includes("/admin/refresh");

      if (isRefreshEndpoint) {
        await storage.remove("token");
        await storage.remove("refreshToken");
        isRefreshing = false;
        refreshPromise = null;
        return Promise.reject(error);
      }

      // 401 → refresh token
      if (
        error?.response?.status === 401 &&
        !(cfg as any)._retryAuth &&
        !isRefreshing
      ) {
        const now = Date.now();

        // Cooldown
        if (now - lastRefreshAttempt < REFRESH_COOLDOWN_MS) {
          await storage.remove("token");
          await storage.remove("refreshToken");
          return Promise.reject(error);
        }

        (cfg as any)._retryAuth = true;
        lastRefreshAttempt = now;

        // If refresh already running → wait
        if (refreshPromise) {
          try {
            const newToken = await refreshPromise;
            if (newToken) {
              cfg.headers = cfg.headers || {};
              (cfg.headers as any).Authorization = `Bearer ${newToken}`;
              return api.request(cfg);
            }
          } catch { }
        }

        // Start refresh
        isRefreshing = true;

        refreshPromise = (async () => {
          try {
            const refreshToken = await storage.get("refreshToken");
            if (!refreshToken) throw new Error("No refresh token");

            const res = await axios.post(
              `${baseURL}/users/refresh`,
              { refresh: refreshToken },
              { timeout: 10000 }
            );

            if (res.status === 200 && res.data?.access) {
              const newAccess = res.data.access;
              const newRefresh = res.data.refresh || refreshToken;

              await storage.set("token", newAccess);
              await storage.set("refreshToken", newRefresh);

              return newAccess;
            }

            throw new Error("Refresh failed");
          } catch (err) {
            await storage.remove("token");
            await storage.remove("refreshToken");
            throw err;
          } finally {
            isRefreshing = false;
            setTimeout(() => {
              refreshPromise = null;
            }, 1000);
          }
        })();

        try {
          const newToken = await refreshPromise;

          if (newToken) {
            cfg.headers = cfg.headers || {};
            (cfg.headers as any).Authorization = `Bearer ${newToken}`;
            return api.request(cfg);
          }
        } catch (err) {
          // only redirect if not in ride flow
          if (!rideFlowFlag) {
            // send to login if required
          }
          return Promise.reject(err);
        }
      }
    } catch { }

    return Promise.reject(error);
  }
);

export default api;

/* ---------- Rider scoped API ---------- */

export const riderApi = (() => {
  const instance = axios.create({
    baseURL,
    withCredentials: false,
  });

  instance.interceptors.request.use(async (config) => {
    try {
      const token = await storage.get("rider_token");
      if (token) {
        config.headers = config.headers || {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }

      const isFormData =
        typeof FormData !== "undefined" && config.data instanceof FormData;

      if (isFormData) {
        delete (config.headers as any)["Content-Type"];
      } else {
        (config.headers as any)["Content-Type"] =
          (config.headers as any)["Content-Type"] || "application/json";
      }
    } catch { }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return instance;
})();

