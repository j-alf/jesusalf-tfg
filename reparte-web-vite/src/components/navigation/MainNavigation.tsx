import {UserGroupIcon} from '@heroicons/react/24/outline';
import NavItem from './NavItem';

export default function MainNavigation() {
    return (
        <nav className="space-y-1">
            <NavItem
                to="/groups"
                icon={UserGroupIcon}
                label="Grupos"
            />
        </nav>
    );
}