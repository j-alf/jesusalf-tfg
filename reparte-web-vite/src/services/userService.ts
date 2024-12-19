import api from './api';
import {User} from './authService';

interface UpdateUserData {
    firstName: string;
    lastName: string;
    email: string;
}

interface UpdatePasswordData {
    currentPassword: string;
    newPassword: string;
}

export const userService = {
    getCurrentUser: async (): Promise<User> => {
        const {data} = await api.get('/users/me');
        return data;
    },

    updateCurrentUser: async (userData: UpdateUserData): Promise<User> => {
        const {data} = await api.put('/users/me', userData);
        return data.user;
    },

    updatePassword: async (passwordData: UpdatePasswordData): Promise<void> => {
        await api.put('/users/me/password', passwordData);
    }
};