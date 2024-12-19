export interface TransactionListItem {
    id?: number;
    name: string;
    amount: string;
    paying_name: string;
}

interface Transaction {
    id: number;
    groupId: number;
    name: string;
    amount: number;
    type: string;
    description?: string;
    paidBy: number;
    splits: Split[] | [];
}

export type TransactionDetails = Transaction;

export type NewTransaction = Omit<Transaction, 'id'>;

export interface Split {
    memberId: number;
    amount: number;
}
