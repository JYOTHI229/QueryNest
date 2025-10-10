import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Should be https://querynest-62hs.onrender.com/api in production
  withCredentials: true, // Important for cookies (access/refresh tokens)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;