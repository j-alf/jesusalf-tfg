import {useState} from 'react';
import {PencilIcon, TrashIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {Member} from '../../services/memberService';
import RefundForm from './RefundForm';
import {TransactionDetails} from "../../hooks/useTransaction.ts";

interface RefundDetailProps {
    refund: TransactionDetails;
    members: Member[];
    onClose: () => void;
    onUpdate: (data: TransactionDetails) => Promise<void>;
    onDelete: () => Promise<void>;
    isUpdating?: boolean;
    isDeleting?: boolean;
}

export default function RefundDetail({
                                         refund,
                                         members,
                                         onClose,
                                         onUpdate,
                                         onDelete,
                                         isUpdating,
                                         isDeleting
                                     }: Readonly<RefundDetailProps>) {
    const [isEditing, setIsEditing] = useState(false);
    const totalSplitAmount = refund.splits.reduce((sum, split) => sum + split.amount, 0);

    const getMemberName = (memberId: number) => {
        const member = members.find(m => m.id === memberId);
        return member?.name ?? `Miembro ${memberId}`;
    };

    const handleUpdate = async (data: TransactionDetails) => {
        await onUpdate(data);
        onClose();
    };

    const handleDelete = async () => {
        if (window.confirm('¿Está seguro de que desea eliminar este reembolso?')) {
            await onDelete();
            onClose();
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        onClose();
    };

    if (isEditing) {
        return (
            <RefundForm
                refund={refund}
                members={members}
                onSubmit={handleUpdate}
                onCancel={handleCancel}
                isLoading={isUpdating}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{refund.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Tipo: {refund.type}
                    </p>
                    <p className="text-sm text-gray-500">
                        Reembolsado por {getMemberName(refund.paidBy)}
                    </p>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                    {refund.amount.toFixed(2)} €
                </div>
            </div>

            {refund.description && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Descripción</h4>
                    <p className="text-gray-600">{refund.description}</p>
                </div>
            )}

            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Reparto</h4>
                <div className="space-y-2">
                    {refund.splits.map((split) => (
                        <div key={split.memberId} className="flex justify-between text-sm">
                            <span className="text-gray-600">{getMemberName(split.memberId)}</span>
                            <span className="text-gray-900">{split.amount.toFixed(2)} €</span>
                        </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>{totalSplitAmount.toFixed(2)} €</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                    title="Cerrar"
                >
                    <XMarkIcon className="h-6 w-6"/>
                </button>
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-50"
                    title="Editar reembolso"
                >
                    <PencilIcon className="h-6 w-6"/>
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Eliminar reembolso"
                >
                    <TrashIcon className="h-6 w-6"/>
                </button>
            </div>
        </div>
    );
}