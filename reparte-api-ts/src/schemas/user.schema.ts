import {z} from 'zod';

export const updateUserSchema = z.object({
    body: z.object({
        firstName: z.string()
            .min(1, 'Name is required'),
        lastName: z.string()
            .min(1, 'Last name is required'),
        email: z.string()
            .email('Incorrect email')
            .min(1, 'Email is required'),
    }),
});

export const updateUserPasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string()
            .min(6, 'The old password must have at least 6 characters'),
        newPassword: z.string()
            .min(6, 'The new password must have at least 6 characters'),
    }),
});

export type updateUserInput = z.infer<typeof updateUserSchema>;

export type updateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>;

export const validateUpdateUserData = (data: {body: unknown }) => {
    return updateUserSchema.safeParse(data);
};

export const validateUpdateUserPasswordData = (data: {body: unknown }) => {
    return updateUserPasswordSchema.safeParse(data);
};
