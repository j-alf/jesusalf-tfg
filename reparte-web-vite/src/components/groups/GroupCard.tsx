import {Group} from '../../services/groupService';
import {PencilIcon, ShareIcon, TrashIcon} from '@heroicons/react/24/outline';
import {Link} from 'react-router-dom';

interface GroupCardProps {
    group: Group;
    onEdit: (group: Group) => void;
    onDelete: (group: Group) => void;
    onInvite: (group: Group) => void;
}

export default function GroupCard({group, onEdit, onDelete, onInvite}: Readonly<GroupCardProps>) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
                <Link to={`/groups/${group.id}`} className="hover:text-blue-600">
                    <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
                </Link>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onInvite(group)}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                        title="Invitar a usuario"
                    >
                        <ShareIcon className="h-6 w-6"/>
                    </button>
                    <button
                        onClick={() => onEdit(group)}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                        title="Editar grupo"
                    >
                        <PencilIcon className="h-6 w-6"/>
                    </button>
                    <button
                        onClick={() => onDelete(group)}
                        className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                        title="Eliminar grupo"
                    >
                        <TrashIcon className="h-6 w-6"/>
                    </button>
                </div>
            </div>
            <p className="text-sm text-gray-500">
                Creado el {new Date(group.created_at).toLocaleDateString()}
            </p>
        </div>
    );
}