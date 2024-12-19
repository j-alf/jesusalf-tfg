import {FormEvent, useEffect, useState} from 'react';
import {CheckIcon, XMarkIcon} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import Input from '../Input';
import {Group} from '../../services/groupService';

interface GroupFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => Promise<void>;
    group?: Group | null;
    isLoading?: boolean;
}

export default function GroupForm({isOpen, onClose, onSubmit, group, isLoading}: Readonly<GroupFormProps>) {
    const [name, setName] = useState('');
    const isEditing = !!group;

    useEffect(() => {
        if (group) {
            setName(group.name);
        } else {
            setName('');
        }
    }, [group]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            await onSubmit(name.trim());
            setName('');
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Editar Grupo" : "Crear Nuevo Grupo"}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ingrese el nombre del grupo"
                    autoFocus
                    required
                />

                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        title="Cancelar"
                    >
                        <XMarkIcon className="h-6 w-6"/>
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="p-2 text-green-500 hover:text-green-700 rounded-full hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isEditing ? "Guardar cambios" : "Crear grupo"}
                    >
                        <CheckIcon className="h-6 w-6"/>
                    </button>
                </div>
            </form>
        </Modal>
    );
}