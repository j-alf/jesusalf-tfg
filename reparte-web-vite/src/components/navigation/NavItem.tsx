import {Link, useLocation} from 'react-router-dom';
import {ComponentType} from "react";

interface NavItemProps {
    to: string;
    icon: ComponentType<{ className?: string }>;
    label: string;
}

export default function NavItem({to, icon: Icon, label}: Readonly<NavItemProps>) {
    const location = useLocation();
    const isActive = location.pathname === to ||
        (to.startsWith('/groups/') && location.pathname.startsWith(to));

    return (
        <Link
            to={to}
            className={`
            flex items-center px-4 py-3 text-sm font-medium rounded-md
            ${isActive
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }
            `}
        >
            <Icon className="mr-3 h-6 w-6"/>
            {label}
        </Link>
    );
}