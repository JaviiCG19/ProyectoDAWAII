import axios from 'axios';


const API_URL = "http://localhost/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['tokenapp'] = token;
    }
  }
  return config;
}, (error) => Promise.reject(error));

export default api;