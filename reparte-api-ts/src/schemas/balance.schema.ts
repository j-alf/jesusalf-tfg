import {z} from 'zod';

export const getBalanceSchema = z.object({
    headers: z.object({
        'x-group-id': z.string()
            .min(1, 'Group ID header is required')
            .regex(/^\d+$/, 'Group ID header must be a numeric string'),
    }),
});

export type getBalanceInput = z.infer<typeof getBalanceSchema>;

export const validateBalanceData = (data: {headers: unknown }) => {
    return getBalanceSchema.safeParse(data);
};
