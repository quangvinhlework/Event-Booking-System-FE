import { createContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log('Token from localStorage:', token);

    if (token) {
      authService.getMyInfo(token)
        .then(response => {
          console.log('User info fetched successfully: ', response.data);
          setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });
      setAccessToken(token);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);

    if (!response.success) {
      console.error('Login error:', response.message);
      throw new Error(response.message || 'Đăng nhập thất bại');
    }

    setUser(response.data.user);
    setAccessToken(response.data.accessToken);
    setIsAuthenticated(true);
    localStorage.setItem('token', response.data.accessToken);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);

    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};