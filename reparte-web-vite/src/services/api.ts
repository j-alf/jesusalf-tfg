import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import {config} from '../config/env';
import {refreshToken} from './authService';

const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (error.response?.status !== 401 || originalRequest.url?.includes('oauth/token')) {
            return Promise.reject(error);
        }

        try {
            const refreshTokenStr = localStorage.getItem('refresh_token');
            if (!refreshTokenStr) {
                return Promise.reject(new Error('No refresh token available'));
            }

            const response = await refreshToken(refreshTokenStr);
            const {access_token, refresh_token} = response;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            originalRequest.headers.Authorization = `Bearer ${access_token}`;

            return api(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(refreshError instanceof Error ? refreshError : new Error(refreshError as string));
        }
    }
);

export default api;