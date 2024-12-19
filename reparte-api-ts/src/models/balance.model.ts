export interface Balance {
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
