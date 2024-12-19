import api from './api';

export interface MemberBalance {
    memberId: number;
    name: string;
    userId: number | null;
    totalPaid: number;
    totalOwed: number;
    netBalance: number;
}

export interface Settlement {
    fromMemberId: number;
    fromMemberName: string;
    toMemberId: number;
    toMemberName: string;
    amount: number;
}

export interface BalanceResponse {
    memberBalances: MemberBalance[];
    settlements: Settlement[];
}

export const balanceService = {
    getGroupBalances: async (groupId: number): Promise<BalanceResponse> => {
        const {data} = await api.get('/balances', {
            headers: {
                'X-Group-ID': groupId
            }
        });
        return data;
    }
};