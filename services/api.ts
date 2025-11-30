
import axios from "axios";

// Base URL: only use EXPO_PUBLIC_API_BASE_URL
const baseURL = process.env?.EXPO_PUBLIC_API_BASE_URL;

if (!baseURL) {
  console.warn('[API] EXPO_PUBLIC_API_BASE_URL is not defined!');
}

const api = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 120000, // 2 minutes for file uploads
});

// Debug: log resolved API base URL once on init
console.log('[API] baseURL =', api.defaults.baseURL);

api.interceptors.request.use((config) => {
  try {
    const publicEndpoints = [
      '/users/send-otp',
      '/users/verify-otp',
      '/users/complete-signup',
      '/bookings/calculate-fare',
      '/bookings/public-status',
      '/bookings/geocode',
      '/bookings/reverse-geocode',
      '/bookings/book'
    ];

    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      config.url?.includes(endpoint)
    );

    if (!isPublicEndpoint) {
      const token = localStorage.getItem('token'); // works in Expo via AsyncStorage wrapper if needed
      const alreadyAuth = !!(config.headers && (config.headers as any).Authorization);
      if (token && !alreadyAuth) {
        config.headers = config.headers || {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }

    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
    if (isFormData) {
      if (config.headers && 'Content-Type' in config.headers) {
        delete (config.headers as any)['Content-Type'];
      }
    } else {
      (config.headers as any)['Content-Type'] = (config.headers as any)['Content-Type'] || 'application/json';
    }
  } catch { }
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
      const url = cfg?.url || '';

      const isRefreshEndpoint = url.includes('/users/refresh') ||
        url.includes('/auth/refresh') ||
        url.includes('/rider/refresh') ||
        url.includes('/admin/refresh');

      if (isRefreshEndpoint) {
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          isRefreshing = false;
          refreshPromise = null;
        } catch { }
        return Promise.reject(error);
      }

      if (error?.response?.status === 401 && !(cfg as any)._retryAuth && !isRefreshing) {
        const now = Date.now();
        if (now - lastRefreshAttempt < REFRESH_COOLDOWN_MS) {
          try {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          } catch { }
          return Promise.reject(error);
        }

        (cfg as any)._retryAuth = true;
        lastRefreshAttempt = now;

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

        isRefreshing = true;
        refreshPromise = (async () => {
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token');

            const res = await axios.post(`${baseURL}/users/refresh`, { refresh: refreshToken }, {
              timeout: 10000,
              validateStatus: (status) => status < 500
            });

            if (res.status === 200 && res.data?.access) {
              const newAccess = res.data.access;
              const newRefresh = res.data.refresh || refreshToken;
              try { localStorage.setItem('token', newAccess); } catch { }
              try { localStorage.setItem('refreshToken', newRefresh); } catch { }
              return newAccess;
            } else {
              throw new Error('Refresh failed');
            }
          } catch (refreshErr) {
            try {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
            } catch { }
            throw refreshErr;
          } finally {
            isRefreshing = false;
            setTimeout(() => { refreshPromise = null; }, 1000);
          }
        })();

        try {
          const newToken = await refreshPromise;
          if (newToken) {
            cfg.headers = cfg.headers || {};
            (cfg.headers as any).Authorization = `Bearer ${newToken}`;
            return api.request(cfg);
          }
        } catch (refreshErr) {
          try {
            const isBookingFlow = sessionStorage.getItem('rideFlow') === 'active';
            const isBookingPage = ['/booking-details', '/ride-initiate', '/booking-confirmation', '/ride-payment-feedback'].some(
              path => window.location.pathname === path
            );
            if (!isBookingFlow && !isBookingPage) {
              window.location.href = '/signin';
            }
          } catch { }
          return Promise.reject(refreshErr);
        }
      }

      const isNetworkError = !error?.response;

      if (!isRefreshEndpoint) {
        console.error('[API] Error', {
          url: cfg?.url,
          method: cfg?.method,
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message,
          code: error?.code,
          isNetworkError
        });
      }

    } catch { }
    return Promise.reject(error);
  }
);

export default api;

// Rider-scoped API
export const riderApi = (() => {
  const instance = axios.create({
    baseURL,
    withCredentials: false
  });

  instance.interceptors.request.use((config) => {
    try {
      const token = localStorage.getItem('rider_token');
      if (token) {
        config.headers = config.headers || {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }

      const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
      if (isFormData) {
        if (config.headers && 'Content-Type' in config.headers) {
          delete (config.headers as any)['Content-Type'];
        }
      } else {
        (config.headers as any)['Content-Type'] = (config.headers as any)['Content-Type'] || 'application/json';
      }
    } catch { }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      try {
        const cfg = error?.config || {};
        const isNetworkError = !error?.response;
        if (isNetworkError) return Promise.reject(error);
      } catch { }
      return Promise.reject(error);
    }
  );

  return instance;
})();

