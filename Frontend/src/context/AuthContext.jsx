import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
    prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
       return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(() => {
        return api(originalRequest);  
         })
         .catch(err => {
           return Promise.reject(err);
          });
        }
       
       originalRequest._retry = true;
       isRefreshing = true;

      try {
       await api.post("/auth/refresh-token");
         processQueue(null);
         return api(originalRequest);
       } catch (err) {
       processQueue(err, null);
       setUser(null);
       return Promise.reject(err);
       } finally {
        isRefreshing = false;
       }
     }

     return Promise.reject(error);
 }
);


  const register = async ({ name, email, password, username }) => {
    const res = await api.post("/auth/register", { name, email, password, username });
    return res.data;
  };

  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    console.log("Login response:", res.data);
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