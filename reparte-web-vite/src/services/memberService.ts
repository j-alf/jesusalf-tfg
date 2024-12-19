import api from './api';

export interface Member {
    id: number;
    name: string;
    user_id: number | null;
    created_at: string;
}

export const memberService = {
    getGroupMembers: async (groupId: number): Promise<Member[]> => {
        const {data} = await api.get('/members', {
            headers: {
                'X-Group-ID': groupId
            }
        });
        return data;
    },

    createMember: async (groupId: number, name: string): Promise<Member> => {
        const {data} = await api.post('/members', {memberName: name}, {
            headers: {
                'X-Group-ID': groupId
            }
        });
        return data;
    },

    updateMember: async (groupId: number, memberId: number, name: string): Promise<void> => {
        await api.put(`/members/${memberId}`, {memberName: name}, {
            headers: {
                'X-Group-ID': groupId
            }
        });
    },

    deleteMember: async (groupId: number, memberId: number): Promise<void> => {
        await api.delete(`/members/${memberId}`, {
            headers: {
                'X-Group-ID': groupId
            }
        });
    },

    associateUserMember: async (memberId: number): Promise<void> => {
        await api.post('/members/associate', {memberId});
    }
};