import axios from 'axios';
import { TOKEN_KEY } from '../services/authService';

const api = axios.create({
    // Bulletproof logic: Use the environment variable if it exists, 
    // otherwise fallback to localhost for local development without Docker.
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const stored = localStorage.getItem(TOKEN_KEY);
        const cleanToken = stored
          ?.replace(/^Bearer\s+/i, "")
          .replace(/^"|"$/g, "")
          .trim();

        if (cleanToken && cleanToken !== 'null' && cleanToken !== 'undefined') {
            config.headers.Authorization = `Bearer ${cleanToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;