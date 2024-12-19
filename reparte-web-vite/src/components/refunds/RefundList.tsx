import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {toast} from 'react-hot-toast';
import {refundService} from '../../services/refundService';
import {Member} from '../../services/memberService';
import Modal from '../Modal';
import RefundDetail from './RefundDetail';
import {TransactionDetails, TransactionListItem} from "../../hooks/useTransaction.ts";

interface RefundListProps {
    refunds: TransactionListItem[];
    members: Member[];
}

export default function RefundList({refunds, members}: Readonly<RefundListProps>) {
    const {groupId} = useParams<{ groupId: string }>();
    const [selectedRefundId, setSelectedRefundId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const {data: refundDetail, isLoading} = useQuery({
        queryKey: ['refund', groupId, selectedRefundId],
        queryFn: () => refundService.getRefundDetails(Number(groupId), selectedRefundId!),
        enabled: !!selectedRefundId && !!groupId
    });

    const updateMutation = useMutation({
        mutationFn: ({id, data}: { id: number, data: TransactionDetails }) =>
            refundService.updateRefund(Number(groupId), id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['refunds', groupId]});
            await queryClient.invalidateQueries({queryKey: ['refund', groupId, selectedRefundId]});
            toast.success('Reembolso actualizado correctamente');
        },
        onError: () => {
            toast.error('Error al actualizar el reembolso');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => refundService.deleteRefund(Number(groupId), id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['refunds', groupId]});
            toast.success('Reembolso eliminado correctamente');
        },
        onError: () => {
            toast.error('Error al eliminar el reembolso');
        }
    });

    const renderRefundList = () => (
        <div className="space-y-4">
            {refunds.map((refund) => (
                <button
                    key={refund.id}
                    onClick={() => refund.id && setSelectedRefundId(refund.id)}
                    className="w-full text-left bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={'Ver detalles de reembolso'}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                {refund.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Reembolsado por {refund.paying_name}
                            </p>
                        </div>
                        <span className="text-lg font-medium text-gray-900">
              {parseFloat(refund.amount).toFixed(2)} €
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

        if (!refundDetail || !selectedRefundId) {
            return null;
        }

        return (
            <RefundDetail
                refund={refundDetail}
                members={members}
                onClose={() => setSelectedRefundId(null)}
                onUpdate={async (data) => {
                    await updateMutation.mutateAsync({id: selectedRefundId, data});
                }}
                onDelete={async () => {
                    await deleteMutation.mutateAsync(selectedRefundId);
                }}
                isUpdating={updateMutation.isPending}
                isDeleting={deleteMutation.isPending}
            />
        );
    };

    return (
        <>
            {renderRefundList()}
            <Modal
                isOpen={!!selectedRefundId}
                onClose={() => setSelectedRefundId(null)}
                title="Detalles de reembolso"
            >
                {renderModalContent()}
            </Modal>
        </>
    );
}