import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // o http://localhost:5000 si no usa /api
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;