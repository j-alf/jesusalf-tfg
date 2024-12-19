import api from './api';

export interface Group {
    id: number;
    name: string;
    invite_code: string;
    created_at: string;
}

export interface GroupInviteResponse {
    group: {
        id: number;
        name: string;
    };
    members: {
        id: number;
        name: string;
        user_id: number | null;
    }[];
}

export const groupService = {
    getGroups: async (): Promise<Group[]> => {
        const {data} = await api.get('/groups');
        return data;
    },

    getGroupDetails: async (id: number): Promise<Group> => {
        const {data} = await api.get(`/groups/${id}`);
        return data;
    },

    createGroup: async (name: string): Promise<Group> => {
        const {data} = await api.post('/groups', {name});
        return data;
    },

    updateGroup: async (id: number, name: string): Promise<Group> => {
        const {data} = await api.put(`/groups/${id}`, {name});
        return data;
    },

    deleteGroup: async (id: number): Promise<void> => {
        await api.delete(`/groups/${id}`);
    },

    inviteToGroup: async (groupId: number, email: string): Promise<void> => {
        await api.post(`/groups/${groupId}/invite`, {email});
    },

    getGroupByInviteCode: async (inviteCode: string): Promise<GroupInviteResponse> => {
        const {data} = await api.get(`/groups/join/${inviteCode}`);
        return data;
    }
};