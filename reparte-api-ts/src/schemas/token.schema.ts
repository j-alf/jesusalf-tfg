import { z } from 'zod';

export const tokenSchema = z.object({
    grant_type: z.enum(['password', 'refresh_token']),
    client_id: z.number(),
    client_secret: z.string(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    refresh_token: z.string().optional(),
    scope: z.string().optional()
});

export type TokenInput = z.infer<typeof tokenSchema>;

export const validateToken = (data: unknown) => {
    return tokenSchema.safeParse(data);
};

