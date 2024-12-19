import {ArrowLeftIcon, RectangleGroupIcon, ScaleIcon, UsersIcon} from '@heroicons/react/24/outline';
import NavItem from './NavItem';
import {useGroup} from '../../hooks/useGroups';

export default function GroupNavigation() {
    const {activeGroupId} = useGroup();

    if (!activeGroupId) return null;

    return (
        <nav className="space-y-1">
            <NavItem
                to="/groups"
                icon={ArrowLeftIcon}
                label="Grupos"
            />
            <NavItem
                to={`/groups/${activeGroupId}`}
                icon={RectangleGroupIcon}
                label="Detalle de grupo"
            />
            <NavItem
                to={`/groups/${activeGroupId}/members`}
                icon={UsersIcon}
                label="Miembros"
            />
            <NavItem
                to={`/groups/${activeGroupId}/balances`}
                icon={ScaleIcon}
                label="Balances"
            />
        </nav>
    );
}
