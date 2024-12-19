import api from './api';
import {TransactionDetails, TransactionListItem} from "../hooks/useTransaction.ts";

export const expenseService = {
    getGroupExpenses: async (groupId: number): Promise<TransactionListItem[]> => {
        const {data} = await api.get('/expenses', {
            headers: {
                'X-Group-ID': groupId
            }
        });
        return data;
    },

    getExpenseDetails: async (groupId: number, expenseId: number): Promise<TransactionDetails> => {
        const {data} = await api.get(`/expenses/${expenseId}`, {
            headers: {
                'X-Group-ID': groupId
            }
        });
        return data;
    },

    createExpense: async (groupId: number, expense: Omit<TransactionDetails, 'id'>): Promise<TransactionDetails> => {
        const {data} = await api.post('/expenses', expense, {
            headers: {
                'X-Group-ID': groupId
            }
        });
        return data;
    },

    updateExpense: async (groupId: number, expenseId: number, expense: TransactionDetails): Promise<TransactionDetails> => {
        const {data} = await api.put(`/expenses/${expenseId}`, expense, {
            headers: {
                'X-Group-ID': groupId
            }
        });
        return data;
    },

    deleteExpense: async (groupId: number, expenseId: number): Promise<void> => {
        await api.delete(`/expenses/${expenseId}`, {
            headers: {
                'X-Group-ID': groupId
            }
        });
    }
};