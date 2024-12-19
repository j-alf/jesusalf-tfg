import {Group} from '../../services/groupService';
import GroupCard from './GroupCard';

interface GroupListProps {
    groups: Group[];
    onEdit: (group: Group) => void;
    onDelete: (group: Group) => void;
    onInvite: (group: Group) => void;
}

export default function GroupList({groups, onEdit, onDelete, onInvite}: Readonly<GroupListProps>) {
    return (
        <div className="grid gap-6">
            {groups.map((group) => (
                <GroupCard
                    key={group.id}
                    group={group}
                    onEdit={() => onEdit(group)}
                    onDelete={() => {
                        if (window.confirm('¿Está seguro de que desea eliminar este grupo?')) {
                            onDelete(group);
                        }
                    }}
                    onInvite={() => onInvite(group)}
                />
            ))}
        </div>
    );
}