import {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({children}: Readonly<LayoutProps>) {
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login"/>;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar/>
            <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-3xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}