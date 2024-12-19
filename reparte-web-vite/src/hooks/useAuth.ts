import {createContext, useContext} from "react";
import {User} from "../services/authService.ts";

interface AuthContextType {
    user: User | null;
    setUser: (user: User) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse en AuthProvider');
    }
    return context;
}
