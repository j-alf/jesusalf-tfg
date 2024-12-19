import {FormEvent, useState} from 'react';
import {CheckIcon, LinkIcon, XMarkIcon} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import {Group} from '../../services/groupService';
import {toast} from 'react-hot-toast';

interface InviteModal {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => Promise<void>;
    group: Group;
    isLoading?: boolean;
}

export default function InviteModal({isOpen, onClose, onSubmit, group, isLoading}: Readonly<InviteModal>) {
    const [email, setEmail] = useState('');
    const [showInviteLink, setShowInviteLink] = useState(false);

    const inviteLink = `${window.location.origin}/join/${group.invite_code}`;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            await onSubmit(email.trim());
            setEmail('');
            onClose();
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            toast.success('¡Enlace de invitación copiado al portapapeles!');
            onClose();
        } catch {
            toast.error('Error al copiar el enlace de invitación');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Invitar a: ${group.name}`}
        >
            <div className="space-y-6">
                <div className="flex space-x-4 mb-6">
                    <Button
                        variant={!showInviteLink ? 'primary' : 'secondary'}
                        onClick={() => setShowInviteLink(false)}
                        className="flex-1"
                        type="button"
                    >
                        Email de invitación
                    </Button>
                    <Button
                        variant={showInviteLink ? 'primary' : 'secondary'}
                        onClick={() => setShowInviteLink(true)}
                        className="flex-1"
                        type="button"
                    >
                        Obtener enlace
                    </Button>
                </div>

                {showInviteLink ? (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Input
                                value={inviteLink}
                                readOnly
                                className="flex-1"
                            />
                            <Button onClick={copyToClipboard} type="button" title={"Copiar enlace"}>
                                <LinkIcon className="h-5 w-5"/>
                            </Button>

                        </div>
                        <p className="text-sm text-gray-500">
                            Comparta este enlace con otras personas para invitarlas al grupo
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Dirección de correo electrónico"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ingrese la dirección de correo electrónico"
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
                                title="Enviar invitación"
                            >
                                <CheckIcon className="h-6 w-6"/>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}