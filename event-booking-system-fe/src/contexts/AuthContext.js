import { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);

  const loadSession = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    setAccessToken(token);
    const response = await authService.getMyInfo();

    if (response.success) {
      setUser(response.data);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      setAccessToken(null);
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = async (email, password) => {
    const response = await authService.login(email, password);

    if (!response.success) {
      throw new Error(response.message || 'Đăng nhập thất bại');
    }

    const { user: userData, accessToken: token } = response.data;
    setUser(userData);
    setAccessToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
  };

  const register = async (userData) => {
    setRegisterLoading(true);
    try {
      const response = await authService.register(userData);
      if (!response.success) {
        throw new Error(response.message || 'Đăng ký thất bại');
      }
      return response.data;
    } finally {
      setRegisterLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const updateMyInfo = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.updateMyInfo(userData);
      if (!response.success) {
        throw new Error(response.message || 'Cập nhật thất bại');
      }
      if (response.data) {
        setUser(response.data);
      }
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const response = await authService.getMyInfo();
    if (response.success) {
      setUser(response.data);
      setIsAuthenticated(true);
    }
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        loading,
        registerLoading,
        login,
        logout,
        register,
        refreshUser,
        updateMyInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
