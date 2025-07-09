// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in

  // ⏱ Auto-refresh access token on 401 error
  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      // Prevent infinite retry loop
      if (
        err.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refreshRes = await api.post("/auth/refresh-token");
          console.log("🔁 Token refreshed:", refreshRes.data.message);
          return api(originalRequest); // retry original request
        } catch (refreshErr) {
          console.error("❌ Refresh failed");
          setUser(null); // auto logout
        }
      }

      return Promise.reject(err);
    }
  );

  // ✅ Register
  const register = async ({ name, email, password, username }) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      username,
    });
    return res.data;
  };

  // ✅ Login
  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    await getProfile(); // fetch user after login
    return res.data;
  };

  // ✅ Fetch user profile
  const getProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
    } catch (err) {
      setUser(null); // Not logged in
    }
  };

  // ✅ Update profile
  const updateProfile = async (updatedData) => {
    const res = await api.put("/user/update", updatedData);
    setUser(res.data.user);
    return res.data;
  };

  // ✅ Logout
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  // ✅ Load user on first mount
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
