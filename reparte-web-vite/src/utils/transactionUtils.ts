interface ValidationErrors {
    [key: string]: string;
}

interface FormData {
    name: string;
    amount: number;
    type: string;
    splits: {
        memberId: number;
        amount: number;
    }[];
}

export const validateForm = (formData: FormData): { isValid: boolean; errors: ValidationErrors } => {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
        errors.name = 'El nombre es necesario';
    }

    if (formData.amount <= 0) {
        errors.amount = 'El importe debe ser mayor a 0';
    }

    if (!formData.type) {
        errors.type = 'El tipo es necesario';
    }

    const totalSplit = formData.splits.reduce((sum, split) => sum + split.amount, 0);
    if (Math.abs(formData.amount - totalSplit) > 0.01) {
        errors.splits = 'El reparto total debe ser igual al importe total';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const formatAmount = (amount: number): string => {
    return amount.toFixed(2);
};

export const validateAmount = (amount: number): boolean => {
    return !isNaN(amount) && amount > 0;
};

export const calculateSplitAmounts = (total: number, numSplits: number): number[] => {
    if (numSplits === 0) return [];

    const equalShare = total / numSplits;
    const roundedShare = Number(equalShare.toFixed(2));

    const amounts = Array(numSplits - 1).fill(roundedShare);
    const totalRounded = roundedShare * (numSplits - 1);
    const lastShare = Number((total - totalRounded).toFixed(2));

    return [...amounts, lastShare];
};
