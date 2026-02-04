
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
  const token = localStorage.getItem('token'); // O donde guardes tu JWT
  if (token) {
    // AQUÍ ESTÁ EL TRUCO: Usar 'tokenapp' en lugar de 'Authorization'
    config.headers['tokenapp'] = token; 
  }
  return config;
});

export default api;