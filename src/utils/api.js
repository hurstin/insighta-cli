import axios from 'axios';
import { loadCredentials, clearCredentials } from './config.js';
import { refreshToken } from './auth.js';

const BACKEND_URL = process.env.INSIGHTA_BACKEND_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BACKEND_URL,
});

api.interceptors.request.use(async (config) => {
  const credentials = await loadCredentials();
  if (credentials && credentials.access_token) {
    config.headers.Authorization = `Bearer ${credentials.access_token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const credentials = await loadCredentials();
      if (credentials && credentials.refresh_token) {
        try {
          const newAccessToken = await refreshToken(credentials.refresh_token);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          await clearCredentials();
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
