import {ReactNode} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import backgroundImage from '../assets/background.jpg'

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({children}: Readonly<AuthLayoutProps>) {
    const {isAuthenticated} = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/groups';

    if (isAuthenticated) {
        return <Navigate to={from}/>;
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
            style={{
                backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.7)), url(${backgroundImage})`,
            }}
        >
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
