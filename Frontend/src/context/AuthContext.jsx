import { createContext, useContext, useState, useEffect } from "react";
import api from "../api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        setUser(res.data.user);
      }; 
      
      const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        setUser(res.data.user);
      };
    

      const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
      };

return (
    <AuthContext.Provider value={{ user, register ,logout , login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);