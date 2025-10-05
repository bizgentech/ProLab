import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password, mode = 'local') => {
    try {
      let result;
      if (mode === 'azure') {
        result = await authService.loginAzure();
      } else {
        result = await authService.loginLocal(email, password);
      }
      setUser(result.user);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};