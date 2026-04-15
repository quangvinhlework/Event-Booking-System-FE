import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);

      // Mockup
      const fakeUser = {
        id: 1,
        name: "Vinh",
        role: "user",
      };
      setUser(fakeUser);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // gọi API thật
    if (email === "user@gmail.com" && password === "1") {
      const fakeResponse = {
        token: "abc123",
        user: {
          id: 1,
          name: "Vinh User",
          role: "user",
        },
      };
      setUser(fakeResponse.user);
      setAccessToken(fakeResponse.token);
      setIsAuthenticated(true);
      localStorage.setItem("token", fakeResponse.token);
    } else {
      const fakeResponse = {
        token: "def456",
        user: {
          id: 2,
          name: "Vinh Organizer",
          role: "organizer",
        },
      };
      setUser(fakeResponse.user);
      setAccessToken(fakeResponse.token);
      setIsAuthenticated(true);
      localStorage.setItem("token", fakeResponse.token);
    }
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