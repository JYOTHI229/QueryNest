import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in

  // 🔁 Automatically refresh token on 401
  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await api.post("/auth/refresh-token");
          return api(originalRequest);
        } catch {
          setUser(null);
        }
      }

      return Promise.reject(err);
    }
  );

  const register = async ({ name, email, password, username }) => {
    const res = await api.post("/auth/register", { name, email, password, username });
    return res.data;
  };

  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    await getProfile();
    return res.data;
  };

  const getProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const updateProfile = async (updatedData) => {
    const res = await api.put("/user/update", updatedData);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

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
