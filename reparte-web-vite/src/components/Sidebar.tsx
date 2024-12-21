import {useAuth} from '../hooks/useAuth';
import {Link} from 'react-router-dom';
import {ArrowLeftEndOnRectangleIcon, Bars3Icon, UserIcon, XMarkIcon} from '@heroicons/react/24/outline';
import MainNavigation from './navigation/MainNavigation';
import GroupNavigation from './navigation/GroupNavigation';
import {useGroup} from '../hooks/useGroups';
import {Logo} from './Logo.tsx';
import {useState} from 'react';

export default function Sidebar() {
    const {logout, user} = useAuth();
    const {activeGroupId} = useGroup();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            {/* Botón menú */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
            >
                <Bars3Icon className="h-6 w-6"/>
            </button>

            {/* Fondo menú */}
            {isOpen && (
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                />
            )}

            {/* Barra lateral */}
            <div
                className={`fixed lg:static inset-y-0 left-0 z-50 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }  lg:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col h-full bg-gray-900 text-white w-64`}
            >
                <div className="p-5">
                    <div className="flex items-center space-x-4">
                        <Logo variant="light" size="md" className="text-white"/>
                        <span className="text-2xl font-bold">ReparTe</span>
                    </div>
                </div>

                <div className="flex-1 px-4">
                    {activeGroupId ? <GroupNavigation/> : <MainNavigation/>}
                </div>

                <div className="p-4 border-t border-gray-700">
                    {user && (
                        <div className="mb-4">
                            <Link
                                to="/profile"
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
                            >
                                <UserIcon className="mr-3 h-6 w-6"/>
                                {user.firstName} {user.lastName}
                            </Link>
                            <button
                                onClick={() => logout()}
                                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
                            >
                                <ArrowLeftEndOnRectangleIcon className="mr-3 h-6 w-6"/>
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>

                {/* Botón cerrar menú */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-300 lg:hidden"
                >
                    <XMarkIcon className="h-6 w-6"/>
                </button>
            </div>
        </div>
    );
}
