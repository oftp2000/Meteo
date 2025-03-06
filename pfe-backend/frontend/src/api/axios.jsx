// src/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  // URL de base de votre API Laravel
  baseURL: 'http://localhost:8000/api',
  // Autorise l'envoi des credentials (cookies, etc.) dans les requêtes
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
