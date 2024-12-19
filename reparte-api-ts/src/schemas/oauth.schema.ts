import {z} from "zod";

export const registerSchema = z.object({
    email: z.string()
        .email('Invalid email')
        .min(1, 'Email is required'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters long'),
    firstName: z.string()
        .min(1, 'First name is required'),
    lastName: z.string()
        .min(1, 'Last name is required')
});

export const loginSchema = z.object({
    email: z.string()
        .email('Invalid email')
        .min(1, 'Email is required'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters long'),
    client_id: z.number(),
    scope: z.string().optional()
});

export const refreshSchema = z.object({
    refresh_token: z.string()
        .min(1, 'Refresh token is required'),
    client_id: z.number()
});


export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;

export const validateRegister = (data: unknown) => {
    return registerSchema.safeParse(data);
};

export const validateLogin = (data: unknown) => {
    return loginSchema.safeParse(data);
};

export const validateRefresh = (data: unknown) => {
    return refreshSchema.safeParse(data);
};
