import {useState} from 'react';
import {CheckIcon, PencilIcon, TrashIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {Member} from '../../services/memberService';
import Input from '../Input';

interface MemberListProps {
    members: Member[];
    onUpdate: (memberId: number, name: string) => Promise<void>;
    onDelete: (memberId: number) => Promise<void>;
    isUpdating?: boolean;
    isDeleting?: boolean;
}

export default function MemberList({members, onUpdate, onDelete, isUpdating, isDeleting}: Readonly<MemberListProps>) {
    const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const handleEdit = (member: Member) => {
        setEditingMemberId(member.id);
        setEditName(member.name);
    };

    const handleCancel = () => {
        setEditingMemberId(null);
        setEditName('');
    };

    const handleUpdate = async (memberId: number) => {
        if (editName.trim()) {
            await onUpdate(memberId, editName.trim());
            setEditingMemberId(null);
            setEditName('');
        }
    };

    const handleDelete = async (memberId: number) => {
        if (window.confirm('¿Está seguro de que desea eliminar a este miembro?')) {
            await onDelete(memberId);
        }
    };

    return (
        <div className="space-y-4">
            {members.map(member => (
                <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                    {editingMemberId === member.id ? (
                        <div className="flex items-center space-x-2 flex-grow mr-4">
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-grow"
                                placeholder="Nombre"
                            />
                            <button
                                onClick={() => handleUpdate(member.id)}
                                disabled={isUpdating}
                                className="p-2 text-green-500 hover:text-green-700 rounded-full hover:bg-green-50 disabled:opacity-50"
                                title="Guardar cambios"
                            >
                                <CheckIcon className="h-6 w-6"/>
                            </button>
                            <button
                                onClick={handleCancel}
                                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                title="Cancelar"
                            >
                                <XMarkIcon className="h-6 w-6"/>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <h3 className="font-medium text-gray-900">{member.name}</h3>
                                {member.user_id && (
                                    <p className="text-sm text-gray-500">Usuario registrado</p>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleEdit(member)}
                                    className="p-2 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-50"
                                    title="Editar miembro"
                                >
                                    <PencilIcon className="h-6 w-6"/>
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    disabled={isDeleting}
                                    className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 disabled:opacity-50"
                                    title="Eliminar miembro"
                                >
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}