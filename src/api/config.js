// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export const AZURE_CONFIG = {
  clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '',
  authority: import.meta.env.VITE_AZURE_AUTHORITY || '',
  redirectUri: import.meta.env.VITE_REDIRECT_URI || 'http://localhost:5173'
};

export const AUTH_MODES = {
  AZURE: 'azure',
  LOCAL: 'local',
  CLIENT: 'client'
};