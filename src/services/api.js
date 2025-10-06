import axios from 'axios';
import { API_CONFIG } from '@/api/config';

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// TEMPORALMENTE DESHABILITADO - Reactivar cuando Laravel esté listo
// El interceptor estaba haciendo logout automático en desarrollo
// porque no hay backend real y cualquier error HTTP dispara 401
/*
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
*/

export default apiClient;