import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminLogin as apiLogin, getAdminProfile } from '../services/adminService.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'srijan_admin_token';
const ADMIN_KEY = 'srijan_admin_data';

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      getAdminProfile()
        .then((res) => {
          setAdmin(res.data);
          localStorage.setItem(ADMIN_KEY, JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(ADMIN_KEY);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await apiLogin(email, password);
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(ADMIN_KEY, JSON.stringify(res.data.admin));
      setAdmin(res.data.admin);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    setAdmin(null);
  }, []);

  const value = {
    admin,
    loading,
    error,
    isAuthenticated: !!admin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
