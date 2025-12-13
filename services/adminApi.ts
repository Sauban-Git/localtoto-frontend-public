
import Constants from "expo-constants";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

/* ---------- Secure Storage Wrapper (RN) ---------- */
const storage = {
  get: async (key: string) => await SecureStore.getItemAsync(key),
  set: async (key: string, value: string) =>
    await SecureStore.setItemAsync(key, value),
  remove: async (key: string) => await SecureStore.deleteItemAsync(key),
};

/* ---------- Base URL ---------- */
const baseURL = __DEV__
  ? `${Constants.manifest.extra.EXPO_PUBLIC_API_BASE_URL}/api`
  : Constants.manifest.extra.EXPO_PUBLIC_API_BASE_URL;

if (!baseURL) {
  console.warn("[AdminAPI] EXPO_PUBLIC_API_BASE_URL is not defined!");
}
/* ---------- Admin API Instance ---------- */
const adminApi = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 120000,
});

/* ---------- Request Interceptor (same as mobile) ---------- */
adminApi.interceptors.request.use(async (config) => {
  try {
    const token = await storage.get("adminAccess");
    const alreadyAuth =
      config.headers && (config.headers as any).Authorization;

    if (token && !alreadyAuth) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
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
  } catch { }

  return config;
});

/* ---------- Refresh Logic (identical to mobile API) ---------- */
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let lastRefreshAttempt = 0;
const REFRESH_COOLDOWN_MS = 5000;

/* ---------- Response Interceptor ---------- */
adminApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    try {
      const cfg = error?.config || {};
      const url = cfg?.url || "";

      const isRefreshEndpoint = url.includes("/admin/refresh");

      if (isRefreshEndpoint) {
        await storage.remove("adminAccess");
        await storage.remove("adminRefresh");
        isRefreshing = false;
        refreshPromise = null;
        return Promise.reject(error);
      }

      // 401 handling with cooldown — same as mobile API
      if (
        error?.response?.status === 401 &&
        !(cfg as any)._retryAdmin &&
        !isRefreshing
      ) {
        const now = Date.now();

        if (now - lastRefreshAttempt < REFRESH_COOLDOWN_MS) {
          await storage.remove("adminAccess");
          await storage.remove("adminRefresh");
          return Promise.reject(error);
        }

        (cfg as any)._retryAdmin = true;
        lastRefreshAttempt = now;

        // Already refreshing? Wait
        if (refreshPromise) {
          try {
            const newToken = await refreshPromise;
            if (newToken) {
              cfg.headers = cfg.headers || {};
              (cfg.headers as any).Authorization = `Bearer ${newToken}`;
              return adminApi.request(cfg);
            }
          } catch { }
        }

        // Start refresh
        isRefreshing = true;

        refreshPromise = (async () => {
          try {
            const refresh = await storage.get("adminRefresh");
            if (!refresh) throw new Error("No refresh token");

            const res = await axios.post(
              `${baseURL}/admin/refresh`,
              { refresh },
              { timeout: 10000 }
            );

            if (res.status === 200 && res.data?.access) {
              const newAccess = res.data.access;
              const newRefresh = res.data.refresh || refresh;

              await storage.set("adminAccess", newAccess);
              await storage.set("adminRefresh", newRefresh);

              return newAccess;
            }

            throw new Error("Refresh failed");
          } catch (err) {
            await storage.remove("adminAccess");
            await storage.remove("adminRefresh");
            throw err;
          } finally {
            isRefreshing = false;
            setTimeout(() => (refreshPromise = null), 1000);
          }
        })();

        try {
          const newToken = await refreshPromise;
          if (newToken) {
            cfg.headers = cfg.headers || {};
            (cfg.headers as any).Authorization = `Bearer ${newToken}`;
            return adminApi.request(cfg);
          }
        } catch (err) {
          // Redirect to admin login page
          if (typeof window !== "undefined") {
            window.location.href = "/admin/login";
          }
          return Promise.reject(err);
        }
      }
    } catch { }

    return Promise.reject(error);
  }
);

export default adminApi;
