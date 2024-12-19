import {ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {loginUser, logout as logoutApi, registerUser, TokenResponse, User} from '../services/authService';
import {userService} from '../services/userService';
import {AuthContext} from '../hooks/useAuth';

export function AuthProvider({children}: Readonly<{ children: ReactNode }>) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const updateAuthState = async (tokens: TokenResponse) => {
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);

        // Fetch user
        const userData = await userService.getCurrentUser();
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const clearAuthState = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                const userData = localStorage.getItem('user');

                if (accessToken && userData) {
                    setUser(JSON.parse(userData));
                } else {
                    clearAuthState();
                }
            } catch {
                clearAuthState();
                if (location.pathname !== '/login' && location.pathname !== '/register') {
                    navigate('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth().catch(error => {
            console.error('Error durante la autentificación:', error);
        });
    }, [navigate, location.pathname]);

    const login = useCallback(async (email: string, password: string) => {
        const tokens = await loginUser(email, password);
        await updateAuthState(tokens);
        navigate('/groups');
    }, [navigate]);

    const register = useCallback(async (firstName: string, lastName: string, email: string, password: string) => {
        await registerUser(firstName, lastName, email, password);
        await login(email, password);
    }, [login]);

    const logout = useCallback(async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuthState();
            navigate('/login');
        }
    }, [navigate]);

    const contextValue = useMemo(() => ({
        user,
        setUser,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading
    }), [user, login, register, logout, isLoading]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
