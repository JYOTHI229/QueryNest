import axios from 'axios';

const api = axios.create({
  baseURL: '/api',           // proxy will handle this
  withCredentials: true,     // for sending cookies
  headers: {
    'Content-Type': 'application/json', 
  },
});

export default api;