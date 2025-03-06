import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api', // Base URL de votre API Laravel
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Intercepteur pour ajouter le token d'authentification (Bearer Token)
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Ajouter le jeton CSRF à toutes les requêtes
instance.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').content;


export default instance;