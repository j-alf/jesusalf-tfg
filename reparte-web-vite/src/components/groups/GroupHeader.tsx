import {PlusIcon} from '@heroicons/react/24/outline';
import Button from '../Button';

interface GroupHeaderProps {
    onCreateClick: () => void;
}

export default function GroupHeader({onCreateClick}: Readonly<GroupHeaderProps>) {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Mis Grupos</h1>
            <Button onClick={onCreateClick} className="flex items-center">
                <PlusIcon className="h-5 w-5 mr-2"/>
                Nuevo Grupo
            </Button>
        </div>
    );
}