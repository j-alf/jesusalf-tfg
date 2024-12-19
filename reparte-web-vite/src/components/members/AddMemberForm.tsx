import {FormEvent, useState} from 'react';
import {CheckIcon, XMarkIcon} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import Input from '../Input';

interface AddMemberFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => Promise<void>;
    isLoading?: boolean;
}

export default function AddMemberForm({isOpen, onClose, onSubmit, isLoading}: Readonly<AddMemberFormProps>) {
    const [name, setName] = useState('');

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
            title="Añadir Nuevo Miembro"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Introduce el nombre"
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
                        title="Añadir miembro"
                    >
                        <CheckIcon className="h-6 w-6"/>
                    </button>
                </div>
            </form>
        </Modal>
    );
}
