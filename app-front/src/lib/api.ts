
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
});

// Interceptor para pegar el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
   
    config.headers['tokenapp'] = token; 
  }
  return config;
});

export default api;