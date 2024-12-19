import api from './api';
import {config} from '../config/env';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope?: string;
}

export const loginUser = async (email: string, password: string): Promise<TokenResponse> => {
    const {data} = await api.post<TokenResponse>('/oauth/token', {
        grant_type: 'password',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        email,
        password,
        scope: '*'
    });
    return data;
};

export const registerUser = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
): Promise<{ userId: number; message: string }> => {
    const {data} = await api.post('/oauth/register', {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        firstName,
        lastName,
        email,
        password
    });
    return data;
};

export const refreshToken = async (refresh_token: string): Promise<TokenResponse> => {
    const {data} = await api.post<TokenResponse>('/oauth/token', {
        grant_type: 'refresh_token',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token
    });
    return data;
};

export const logout = async (): Promise<void> => {
    await api.post('/oauth/logout');
};
