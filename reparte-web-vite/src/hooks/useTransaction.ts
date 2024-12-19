import {useCallback, useEffect, useState} from 'react';
import {Member} from '../services/memberService';
import {calculateSplitAmounts, validateAmount} from "../utils/transactionUtils";

export interface Split {
    memberId: number;
    amount: number;
}

export interface TransactionDetails {
    id?: number;
    groupId: number;
    name: string;
    amount: number;
    type: string;
    description?: string;
    paidBy: number;
    splits: Split[] | [];
}

export interface TransactionListItem {
    id?: number;
    name: string;
    amount: string;
    paying_name: string;
}

interface UseTransactionFormProps {
    transaction: TransactionDetails;
    members: Member[];
/*    onSubmit: (data: TransactionDetails) => Promise<void>;
    onCancel: () => void;*/
}

export function useTransactionForm({
                                       transaction,
                                       members
                                   }: UseTransactionFormProps) {
    const [formData, setFormData] = useState<TransactionDetails>(transaction);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);
    const [manualSplits, setManualSplits] = useState(false);

    const updateSplitAmounts = useCallback((amount: number, splits: Split[]) => {
        const amounts = calculateSplitAmounts(amount, splits.length);

        return splits.map((split, index) => ({
            ...split,
            amount: amounts[index]
        }));
    }, []);

    const handleAmountChange = (newAmount: number) => {
        if (!validateAmount(newAmount)) return;

        setFormData(prev => ({
            ...prev,
            amount: newAmount,
            splits: manualSplits ? prev.splits : updateSplitAmounts(newAmount, prev.splits)
        }));
    };

    const handleSplitAmountChange = (memberId: number, amount: number) => {
        if (!validateAmount(amount)) return;

        setManualSplits(true);
        setFormData(prev => ({
            ...prev,
            splits: prev.splits.map(split =>
                split.memberId === memberId
                    ? { ...split, amount: Number(amount.toFixed(2)) }
                    : split
            )
        }));
    };

    const addMemberToSplit = (memberId: number) => {
        if (!formData.splits.some(split => split.memberId === memberId)) {
            setFormData(prev => {
                const newSplits = [...prev.splits, { memberId, amount: 0 }];
                return {
                    ...prev,
                    splits: updateSplitAmounts(prev.amount, newSplits)
                };
            });
            setManualSplits(false);
        }
        setShowMemberDropdown(false);
    };

    const removeMemberFromSplit = (memberId: number) => {
        setFormData(prev => {
            const newSplits = prev.splits.filter(split => split.memberId !== memberId);
            return {
                ...prev,
                splits: updateSplitAmounts(prev.amount, newSplits)
            };
        });
        setManualSplits(false);
    };

    useEffect(() => {
        if (!manualSplits) {
            setFormData(prev => ({
                ...prev,
                splits: updateSplitAmounts(prev.amount, prev.splits)
            }));
        }
    }, [formData.amount, manualSplits, updateSplitAmounts]);

    useEffect(() => {
        const handleClickOutside = (event: PointerEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.member-dropdown-container')) {
                setShowMemberDropdown(false);
            }
        };

        document.addEventListener('pointerdown', handleClickOutside);
        return () => document.removeEventListener('pointerdown', handleClickOutside);
    }, []);

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        showMemberDropdown,
        setShowMemberDropdown,
        manualSplits,
        handleAmountChange,
        handleSplitAmountChange,
        addMemberToSplit,
        removeMemberFromSplit,
        availableMembers: members.filter(
            member => !formData.splits.some(split => split.memberId === member.id)
        )
    };
}