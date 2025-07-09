import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in

  // Auto-refresh access token on 401
  api.interceptors.response.use(
    res => res,
    async (err) => {
      const originalRequest = err.config;

      // Check if refresh token cookie exists
      const hasRefreshToken = document.cookie.includes("refreshToken");

      if (
        err.response?.status === 401 &&
        !originalRequest._retry &&
        hasRefreshToken
      ) {
        originalRequest._retry = true;
        try {
          await api.post("/auth/refresh-token");
          return api(originalRequest);
        } catch {
          setUser(null); // Refresh failed → logout user
        }
      }

      return Promise.reject(err);
    }
  );

  // Register
  const register = async ({ name, email, password, username }) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      username,
    });
    return res.data;
  };

  // Login
  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    await getProfile(); // fetch full user info from /user/profile
    return res.data;
  };

  // Fetch profile
  const getProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
    } catch {
      setUser(null); // Not logged in
    }
  };

  // Update profile
  const updateProfile = async (updatedData) => {
    try {
      const res = await api.put("/user/update", updatedData);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // Logout
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  // Load user on mount
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, getProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
