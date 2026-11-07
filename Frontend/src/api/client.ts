import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Storage key for user session
export const AUTH_STORAGE_KEY = 'supportly_auth_session';

// Base URL resolution: prioritize VITE_API_BASE_URL, fallback to empty string (which uses Vite dev proxy '/api')
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Centralized session helper to avoid token leakage
export function getStoredSession(): { token: string; email: string; businessName: string } | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.token === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredSession(session: { token: string; email: string; businessName: string }): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch {
    console.error('Failed to store session');
  }
}

export function clearStoredSession(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Ignore error
  }
}

// Custom event for unauthorized events to let AuthContext react gracefully
export const AUTH_UNAUTHORIZED_EVENT = 'supportly:auth:unauthorized';

export function triggerUnauthorized() {
  clearStoredSession();
  window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
}

// Request interceptor: attach Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const session = getStoredSession();
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401, 403, network, validation errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      // Network failure or backend down
      const networkMessage =
        'Backend server unreachable at ' +
        (baseURL || 'http://localhost:8080') +
        '. Please verify the Spring Boot service is running.';
      return Promise.reject(new Error(networkMessage));
    }

    const { status, data } = error.response;

    if (status === 401) {
      // Session expired or invalid token
      // Only trigger if we had a token or was a protected route
      triggerUnauthorized();
      const message =
        (data as any)?.message ||
        (data as any)?.error ||
        'Session expired. Please log in again.';
      return Promise.reject(new Error(message));
    }

    if (status === 403) {
      const message =
        (data as any)?.message ||
        'Access denied. You do not have permission to perform this action.';
      return Promise.reject(new Error(message));
    }

    // Extract human-friendly error message from standard Spring Boot error responses
    let errorMessage = 'An unexpected error occurred.';
    if (typeof data === 'string' && data.length > 0) {
      errorMessage = data;
    } else if (typeof data === 'object' && data !== null) {
      const errObj = data as Record<string, any>;
      if (errObj.message) {
        errorMessage = errObj.message;
      } else if (errObj.error) {
        errorMessage = errObj.error;
      } else if (errObj.errors) {
        if (Array.isArray(errObj.errors)) {
          errorMessage = errObj.errors.map((e: any) => (typeof e === 'string' ? e : e.defaultMessage || JSON.stringify(e))).join(', ');
        } else if (typeof errObj.errors === 'object') {
          errorMessage = Object.values(errObj.errors).join(', ');
        }
      }
    }

    return Promise.reject(new Error(errorMessage));
  }
);
