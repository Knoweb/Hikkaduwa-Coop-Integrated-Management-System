import axios, { type InternalAxiosRequestConfig } from 'axios';

// Create a centralized instance pointing to your API Gateway
const api = axios.create({
    baseURL: 'http://localhost:8080', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Attach the JWT to every outgoing request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('jwt_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

export default api;