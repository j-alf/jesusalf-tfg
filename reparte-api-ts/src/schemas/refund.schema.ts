import {z} from 'zod';

export const createRefundSchema = z.object({
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

export const updateRefundSchema = z.object({
    headers: z.object({
        'x-group-id': z.string()
            .min(1, 'Group ID header is required')
            .regex(/^\d+$/, 'Group ID header must be a numeric string'),
    }),
    params: z.object({
        refundId: z.string()
            .min(1, 'Refund ID is required')
            .regex(/^\d+$/, 'Refund ID must be a numeric string'),
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

export const detailsRefundSchema = z.object({
    headers: z.object({
        'x-group-id': z.string()
            .min(1, 'Group ID header is required')
            .regex(/^\d+$/, 'Group ID header must be a numeric string'),
    }),
    params: z.object({
        refundId: z.string()
            .min(1, 'Refund ID is required')
            .regex(/^\d+$/, 'Refund ID must be a numeric string'),
    }),
});

export const deleteRefundSchema = z.object({
    headers: z.object({
        'x-group-id': z.string()
            .min(1, 'Group ID header is required')
            .regex(/^\d+$/, 'Group ID header must be a numeric string'),
    }),
    params: z.object({
        refundId: z.string()
            .min(1, 'Refund ID is required')
            .regex(/^\d+$/, 'Refund ID must be a numeric string'),
    }),
});

export type CreateRefundInput = z.infer<typeof createRefundSchema>;

export type UpdateRefundInput = z.infer<typeof updateRefundSchema>;

export type DetailsRefundInput = z.infer<typeof detailsRefundSchema>;

export type DeleteRefundInput = z.infer<typeof deleteRefundSchema>;

export const validateCreateRefundData = (data: {headers: unknown; body: unknown }) => {
    return createRefundSchema.safeParse(data);
};

export const validateUpdateRefundData = (data: {headers: unknown; params: unknown; body: unknown }) => {
    return updateRefundSchema.safeParse(data);
};

export const validateDetailsRefundData = (data: {headers: unknown; params: unknown }) => {
    return detailsRefundSchema.safeParse(data);
};

export const validateDeleteRefundData = (data: {headers: unknown; params: unknown }) => {
    return deleteRefundSchema.safeParse(data);
};
