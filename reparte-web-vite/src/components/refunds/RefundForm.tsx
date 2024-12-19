import {FormEvent} from 'react';
import {CheckIcon, PlusCircleIcon, TrashIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {Member} from '../../services/memberService';
import {formatAmount, validateForm} from '../../utils/transactionUtils';
import {TransactionDetails, useTransactionForm} from '../../hooks/useTransaction';
import Input from '../Input';

interface RefundFormProps {
    refund: TransactionDetails;
    members: Member[];
    onSubmit: (data: TransactionDetails) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function RefundForm({refund, members, onSubmit, onCancel, isLoading}: Readonly<RefundFormProps>) {
    const {
        formData,
        setFormData,
        errors,
        setErrors,
        showMemberDropdown,
        setShowMemberDropdown,
        handleAmountChange,
        handleSplitAmountChange,
        addMemberToSplit,
        removeMemberFromSplit,
        availableMembers
    } = useTransactionForm({
        transaction: refund,
        members
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validation = validateForm(formData);
        if (validation.isValid) {
            await onSubmit(formData);
        } else {
            setErrors(validation.errors);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                label="Nombre"
                value={formData.name}
                onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                error={errors.name}
            />

            <Input
                label="Importe"
                type="number"
                step="1"
                value={formData.amount}
                onChange={e => handleAmountChange(parseFloat(e.target.value))}
                error={errors.amount}
            />

            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                </label>
                <select
                    id="type"
                    name="type"
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                    value={formData.type}
                    onChange={e => setFormData(prev => ({...prev, type: e.target.value}))}
                >
                    <option value="">Selecciona un tipo</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Bizum">Bizum</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Otros">Otros</option>
                </select>
                {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
            </div>

            <div>
                <label htmlFor="refundBy" className="block text-sm font-medium text-gray-700 mb-2">
                    Reembolsado por
                </label>
                <select
                    id="refundBy"
                    name="refundBy"
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                    value={formData.paidBy}
                    onChange={e => setFormData(prev => ({...prev, paidBy: parseInt(e.target.value)}))}
                >
                    {members.map(member => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (opcional)
                </label>
                <textarea
                    id="description"
                    name="description"
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                    value={formData.description ?? ''}
                    onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
                    rows={3}
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="memberDropdown" className="block text-sm font-medium text-gray-700">
                        Reparto
                    </label>
                    {availableMembers.length > 0 && (
                        <div className="relative member-dropdown-container">
                            <button
                                id="memberDropdown"
                                type="button"
                                onClick={() => setShowMemberDropdown(!showMemberDropdown)}
                                className="p-1 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-50"
                                title="Añadir miembro al reparto"
                            >
                                <PlusCircleIcon className="h-8 w-8"/>
                            </button>

                            {showMemberDropdown && (
                                <div
                                    className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 max-h-60 overflow-y-auto">
                                    <div className="py-1" role="menu">
                                        {availableMembers.map(member => (
                                            <button
                                                key={member.id}
                                                type="button"
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => addMemberToSplit(member.id)}
                                            >
                                                {member.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {errors.splits && (
                    <p className="text-sm text-red-600 mb-2">{errors.splits}</p>
                )}

                <div className="space-y-2">
                    {formData.splits.map(split => {
                        const member = members.find(m => m.id === split.memberId);
                        return (
                            <div key={split.memberId} className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 flex-grow">
                  {member?.name}
                </span>
                                <input
                                    type="number"
                                    step="1"
                                    value={formatAmount(split.amount)}
                                    onChange={e => handleSplitAmountChange(split.memberId, parseFloat(e.target.value))}
                                    className="w-24 px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeMemberFromSplit(split.memberId)}
                                    className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                                    title="Quitar miembro del reparto"
                                >
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                    title="Cancelar"
                >
                    <XMarkIcon className="h-6 w-6"/>
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="p-2 text-green-500 hover:text-green-700 rounded-full hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Guardar cambios"
                >
                    <CheckIcon className="h-6 w-6"/>
                </button>
            </div>
        </form>
    );
}
