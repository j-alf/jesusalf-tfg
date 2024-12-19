import {z} from 'zod';

export const groupIdSchema = z.object({
    groupId: z.string()
        .min(1, 'Group ID is required')
        .regex(/^\d+$/, 'Group ID must be a numeric string')
});

export const groupDetailsSchema = z.object({
    params: z.object({
        groupId: z.string()
            .min(1, 'Group ID is required')
            .regex(/^\d+$/, 'Group ID must be a numeric string'),
    }),
});

export const createGroupSchema = z.object({
    body: z.object({
        name: z.string()
            .min(1, 'Name must be at least 1 characters long'),
    }),
});

export const updateGroupSchema = z.object({
    params: z.object({
        groupId: z.string()
            .min(1, 'Group ID is required')
            .regex(/^\d+$/, 'Group ID must be a numeric string'),
    }),
    body: z.object({
        name: z.string()
            .min(1, 'Name must be at least 1 characters long'),
    }),
});

export const deleteGroupSchema = z.object({
    params: z.object({
        groupId: z.string()
            .min(1, 'Group ID is required')
            .regex(/^\d+$/, 'Group ID must be a numeric string'),
    }),
});

export const inviteGroupSchema = z.object({
    params: z.object({
        inviteCode: z.string()
            .min(1, 'Invite code is required'),
    }),
});

export const inviteEmailGroupSchema = z.object({
    params: z.object({
        groupId: z.string()
            .min(1, 'Group ID is required')
            .regex(/^\d+$/, 'Group ID must be a numeric string'),
    }),
    body: z.object({
        email: z.string()
            .email('Email invalid')
            .min(1, 'Email is required'),
    }),
});

export type GroupIdInput = z.infer<typeof groupIdSchema>;

export type GroupDetailsInput = z.infer<typeof groupDetailsSchema>;

export type CreateGroupInput = z.infer<typeof createGroupSchema>;

export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;

export type DeleteGroupInput = z.infer<typeof deleteGroupSchema>;

export type InviteGroupInput = z.infer<typeof inviteGroupSchema>;

export type InviteEmailGroupInput = z.infer<typeof inviteEmailGroupSchema>;

export const validateGroupIdParams = (data: unknown) => {
    return groupIdSchema.safeParse(data);
};

export const validateDetailsGroupData = (data: { params: unknown }) => {
    return groupDetailsSchema.safeParse(data);
}

export const validateCreateGroupData = (data: { body: unknown }) => {
    return createGroupSchema.safeParse(data);
};

export const validateUpdateGroupData = (data: { params: unknown, body: unknown }) => {
    return updateGroupSchema.safeParse(data);
};

export const validateDeleteGroupData = (data: { params: unknown }) => {
    return deleteGroupSchema.safeParse(data);
};

export const validateInviteGroupData = (data: { params: unknown }) => {
    return inviteGroupSchema.safeParse(data);
};

export const validateInviteEmailGroupData = (data: { params: unknown; body: unknown }) => {
    return inviteEmailGroupSchema.safeParse(data);
};