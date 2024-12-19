import api from './api';
import {TransactionDetails, TransactionListItem} from '../hooks/useTransaction.ts';

export const refundService = {
    getGroupRefunds: async (groupId: number): Promise<TransactionListItem[]> => {
        const {data} = await api.get('/refunds', {
            headers: {
                'X-Group-ID': groupId
            }
        });
        return data;
    },

    getRefundDetails: async (groupId: number, refundId: number): Promise<TransactionDetails> => {
        const {data} = await api.get(`/refunds/${refundId}`, {
            headers: {
                'X-Group-ID': groupId
            }
        });
        return data;
    },

    createRefund: async (groupId: number, refund: Omit<TransactionDetails, 'id'>): Promise<TransactionDetails> => {
        const {data} = await api.post('/refunds', refund, {
            headers: {
                'X-Group-ID': groupId
            }
        });
        return data;
    },

    updateRefund: async (groupId: number, refundId: number, refund: TransactionDetails): Promise<TransactionDetails> => {
        const {data} = await api.put(`/refunds/${refundId}`, refund, {
            headers: {
                'X-Group-ID': groupId
            }
        });
        return data;
    },

    deleteRefund: async (groupId: number, refundId: number): Promise<void> => {
        await api.delete(`/refunds/${refundId}`, {
            headers: {
                'X-Group-ID': groupId
            }
        });
    }
};