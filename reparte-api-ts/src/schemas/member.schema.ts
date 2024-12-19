import {z} from 'zod';

export const getMembersSchema = z.object({
    headers: z.object({
        'x-group-id': z.string()
            .min(1, 'Group ID header is required')
            .regex(/^\d+$/, 'Group ID header must be a numeric string'),
    }),
});
export const addMemberSchema = z.object({
    headers: z.object({
        'x-group-id': z.string()
            .min(1, 'Group ID header is required')
            .regex(/^\d+$/, 'Group ID header must be a numeric string'),
    }),
    body: z.object({
        memberName: z.string()
            .min(1, 'Name must be at least 1 characters long'),
    }),
});

export const updateMemberSchema = z.object({
    headers: z.object({
        'x-group-id': z.string()
            .min(1, 'Group ID header is required')
            .regex(/^\d+$/, 'Group ID header must be a numeric string'),
    }),
    params: z.object({
        memberId: z.string()
        .min(1, 'Member ID is required')
            .regex(/^\d+$/, 'Member ID must be a numeric string')
    }),
    body: z.object({
        memberName: z.string()
            .min(1, 'Name must be at least 1 characters long'),
    }),
});

export const deleteMemberSchema = z.object({
    headers: z.object({
        'x-group-id': z.string()
            .min(1, 'Group ID header is required')
            .regex(/^\d+$/, 'Group ID header must be a numeric string'),
    }),
    params: z.object({
        memberId: z.string()
            .min(1, 'Member ID is required')
            .regex(/^\d+$/, 'Member ID must be a numeric string')
    })
});

export const associateUserMemberSchema = z.object({
    body: z.object({
        memberId: z.number()
            .min(1, 'Member ID is required'),
    }),
});

export type GetMembersInput = z.infer<typeof getMembersSchema>;

export type AddMemberInput = z.infer<typeof addMemberSchema>;

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

export type DeleteMemberInput = z.infer<typeof deleteMemberSchema>;

export type AssociateUserMemberInput = z.infer<typeof associateUserMemberSchema>;

export const validateGetMembersData = (data: {headers: unknown }) => {
    return getMembersSchema.safeParse(data);
};
export const validateAddMemberData = (data: {headers: unknown; body: unknown }) => {
    return addMemberSchema.safeParse(data);
};

export const validateUpdateMemberData = (data: {headers: unknown; params: unknown; body: unknown }) => {
    return updateMemberSchema.safeParse(data);
};

export const validateDeleteMemberData = (data: {headers: unknown; params: unknown }) => {
    return deleteMemberSchema.safeParse(data);
};

export const validateAssociateUserMemberData = (data: {body: unknown }) => {
    return associateUserMemberSchema.safeParse(data);
};
