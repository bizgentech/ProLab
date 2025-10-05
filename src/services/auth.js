import apiClient from './api';
import { PublicClientApplication } from '@azure/msal-browser';
import { AZURE_CONFIG, AUTH_MODES } from '@/api/config';

// Mock data para desarrollo (eliminar cuando Laravel esté listo)
const MOCK_USERS = {
  'admin@cti.com': { 
    password: 'admin123', 
    role: 'admin',
    name: 'Admin User',
    email: 'admin@cti.com'
  },
  'tech@cti.com': { 
    password: 'tech123', 
    role: 'field_technician',
    name: 'Field Tech',
    email: 'tech@cti.com'
  },
  'client@example.com': { 
    password: 'client123', 
    role: 'client',
    name: 'Client User',
    email: 'client@example.com'
  }
};

let msalInstance = null;

// Initialize Azure MSAL
const initializeMsal = () => {
  if (!msalInstance && AZURE_CONFIG.clientId) {
    msalInstance = new PublicClientApplication({
      auth: {
        clientId: AZURE_CONFIG.clientId,
        authority: AZURE_CONFIG.authority,
        redirectUri: AZURE_CONFIG.redirectUri
      }
    });
  }
  return msalInstance;
};

export const authService = {
  // Login local (mock - reemplazar con Laravel)
  async loginLocal(email, password) {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USERS[email];
    if (user && user.password === password) {
      const token = 'mock-token-' + Date.now();
      const userData = {
        id: Date.now(),
        email: user.email,
        name: user.name,
        role: user.role,
        authMode: AUTH_MODES.LOCAL
      };
      
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { user: userData, token };
    }
    
    throw new Error('Invalid credentials');
  },

  // Login con Azure AD
  async loginAzure() {
    const msal = initializeMsal();
    if (!msal) {
      throw new Error('Azure AD not configured');
    }

    try {
      const loginResponse = await msal.loginPopup({
        scopes: ['user.read']
      });

      const userData = {
        id: loginResponse.account.localAccountId,
        email: loginResponse.account.username,
        name: loginResponse.account.name,
        role: 'admin', // Determinar del backend
        authMode: AUTH_MODES.AZURE
      };

      localStorage.setItem('access_token', loginResponse.accessToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { user: userData, token: loginResponse.accessToken };
    } catch (error) {
      throw new Error('Azure login failed: ' + error.message);
    }
  },

  // Logout
  logout() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.authMode === AUTH_MODES.AZURE && msalInstance) {
        msalInstance.logoutPopup();
      }
    }
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
};