import {z} from 'zod';

export const createExpenseSchema = z.object({
    headers: z.object({
        'x-group-id': z.string()
            .min(1, 'Group ID header is required')
            .regex(/^\d+$/, 'Group ID header must be a numeric string'),
    }),
    body: z.object({
        name: z.string().min(1, 'Name is required').max(60, 'Name must be less than 60 characters long'),
        amount: z.number().positive('Amount must be greater than zero'),
        type: z.string().min(1, 'Type is required').max(100, 'Name must be less than 100 characters long'),
        description: z.string().max(255, 'Description must be less than 255 characters long').optional(),
        paidBy: z.number().int().positive('PaidBy must be a valid member ID'),
        splits: z.array(
            z.object({
                memberId: z.number().int().positive('Member ID must be valid'),
                amount: z.number().nonnegative('Split amount must be non-negative'),
            })
        ).min(1, 'Splits must have at least one entry'),
    }),
});

export const updateExpenseSchema = z.object({
    headers: z.object({
        'x-group-id': z.string()
            .min(1, 'Group ID header is required')
            .regex(/^\d+$/, 'Group ID header must be a numeric string'),
    }),
    params: z.object({
        expenseId: z.string()
            .min(1, 'Expense ID is required')
            .regex(/^\d+$/, 'Expense ID must be a numeric string'),
    }),
    body: z.object({
        name: z.string().min(1, 'Name is required').max(60, 'Name must be less than 60 characters long'),
        amount: z.number().positive('Amount must be greater than zero'),
        type: z.string().min(1, 'Type is required').max(100, 'Name must be less than 100 characters long'),
        description: z.string().max(255, 'Description must be less than 255 characters long').optional(),
        paidBy: z.number().int().positive('PaidBy must be a valid member ID'),
        splits: z.array(
            z.object({
                memberId: z.number().int().positive('Member ID must be valid'),
                amount: z.number().nonnegative('Split amount must be non-negative'),
            })
        ).min(1, 'Splits must have at least one entry'),
    }),
});

export const detailsExpenseSchema = z.object({
    headers: z.object({
        'x-group-id': z.string()
            .min(1, 'Group ID header is required')
            .regex(/^\d+$/, 'Group ID header must be a numeric string'),
    }),
    params: z.object({
        expenseId: z.string()
            .min(1, 'Expense ID is required')
            .regex(/^\d+$/, 'Expense ID must be a numeric string'),
    }),
});

export const deleteExpenseSchema = z.object({
    headers: z.object({
        'x-group-id': z.string()
            .min(1, 'Group ID header is required')
            .regex(/^\d+$/, 'Group ID header must be a numeric string'),
    }),
    params: z.object({
        expenseId: z.string()
            .min(1, 'Expense ID is required')
            .regex(/^\d+$/, 'Expense ID must be a numeric string'),
    }),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

export type DetailsExpenseInput = z.infer<typeof detailsExpenseSchema>;

export type DeleteExpenseInput = z.infer<typeof deleteExpenseSchema>;

export const validateCreateExpenseData = (data: {headers: unknown; body: unknown }) => {
    return createExpenseSchema.safeParse(data);
};

export const validateUpdateExpenseData = (data: {headers: unknown; params: unknown; body: unknown }) => {
    return updateExpenseSchema.safeParse(data);
};

export const validateDetailsExpenseData = (data: {headers: unknown; params: unknown }) => {
    return detailsExpenseSchema.safeParse(data);
};

export const validateDeleteExpenseData = (data: {headers: unknown; params: unknown }) => {
    return deleteExpenseSchema.safeParse(data);
};
