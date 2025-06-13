import { createContext, useContext, useState, useEffect } from "react";
import api from "../api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        setUser(res.data.user);
      }; 
      
      const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        setUser(res.data.user);
      };


      const getProfile = async () => {
        try {
          const res = await api.get("/user/profile");
          setUser(res.data);
        } catch (err) {
          console.log("Not logged in yet");
        }
      };
    
      
      useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await api.get("/user/profile"); // No need to pass token manually if cookies are sent
            setUser(res.data); // ✅ Logged in
          } catch (err) {
            setUser(null); // ❌ Not logged in
          }
        };
      
        fetchUser();
      }, []);

    
      const updateProfile = async (updatedData) => {
        try {
          const res = await api.put("/user/update", updatedData); // PUT request to backend
          setUser(res.data); // Update local user state
          return res.data;
        } catch (err) {
          throw err.response?.data || err;
        }
      };
      
      const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
      };

return (
    <AuthContext.Provider value={{ user, register ,login , getProfile , updateProfile ,  logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);