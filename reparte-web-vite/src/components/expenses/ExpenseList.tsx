import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'react-hot-toast';
import {expenseService} from '../../services/expenseService';
import {Member} from '../../services/memberService';
import Modal from '../Modal';
import ExpenseDetail from './ExpenseDetail';
import {TransactionDetails, TransactionListItem} from "../../hooks/useTransaction.ts";

interface ExpenseListProps {
    expenses: TransactionListItem[];
    members: Member[];
}

export default function ExpenseList({expenses, members}: Readonly<ExpenseListProps>) {
    const {groupId} = useParams<{ groupId: string }>();
    const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const {data: expenseDetail, isLoading} = useQuery({
        queryKey: ['expense', groupId, selectedExpenseId],
        queryFn: () => expenseService.getExpenseDetails(Number(groupId), selectedExpenseId!),
        enabled: !!selectedExpenseId && !!groupId
    });

    const updateMutation = useMutation({
        mutationFn: ({id, data}: { id: number, data: TransactionDetails }) =>
            expenseService.updateExpense(Number(groupId), id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['expenses', groupId]});
            await queryClient.invalidateQueries({queryKey: ['expense', groupId, selectedExpenseId]});
            toast.success('Gasto actualizado correctamente');
        },
        onError: () => {
            toast.error('Error al actualizar el gasto');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => expenseService.deleteExpense(Number(groupId), id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['expenses', groupId]});
            toast.success('Gasto eliminado correctamente');
        },
        onError: () => {
            toast.error('Error al eliminar el gasto');
        }
    });

    const renderExpenseList = () => (
        <div className="space-y-4">
            {expenses.map((expense) => (
                <button
                    key={expense.id}
                    onClick={() => expense.id && setSelectedExpenseId(expense.id)}
                    className="w-full text-left bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={'Ver detalles de gasto'}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                {expense.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Pagado por {expense.paying_name}
                            </p>
                        </div>
                        <span className="text-lg font-medium text-gray-900">
              {parseFloat(expense.amount).toFixed(2)} €
            </span>
                    </div>
                </button>
            ))}
        </div>
    );

    const renderModalContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center py-4">
                    <div className="text-gray-600">Cargando...</div>
                </div>
            );
        }

        if (!expenseDetail || !selectedExpenseId) {
            return null;
        }

        return (
            <ExpenseDetail
                expense={expenseDetail}
                members={members}
                onClose={() => setSelectedExpenseId(null)}
                onUpdate={async (data) => {
                    await updateMutation.mutateAsync({id: selectedExpenseId, data});
                }}
                onDelete={async () => {
                    await deleteMutation.mutateAsync(selectedExpenseId);
                }}
                isUpdating={updateMutation.isPending}
                isDeleting={deleteMutation.isPending}
            />
        );
    };

    return (
        <>
            {renderExpenseList()}
            <Modal
                isOpen={!!selectedExpenseId}
                onClose={() => setSelectedExpenseId(null)}
                title="Detalles de gasto"
            >
                {renderModalContent()}
            </Modal>
        </>
    );
}
