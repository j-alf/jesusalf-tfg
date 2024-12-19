import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {toast} from 'react-hot-toast';
import {Group, groupService} from '../services/groupService';
import {createContext, useContext} from "react";
import {Member} from "../services/memberService.ts";

interface GroupContextType {
    activeGroupId: number | null;
    setActiveGroupId: (groupId: number | null) => void;
    activeGroup: Group | null;
    groupMembers: Member[];
    isLoading: boolean;
    refreshMembers: () => Promise<void>;
}

export const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function useGroup() {
    const context = useContext(GroupContext);
    if (context === undefined) {
        throw new Error('useGroup debe usarse en GroupProvider');
    }
    return context;
}

export function useGroups() {
    const queryClient = useQueryClient();

    const { data: groups = [], isLoading } = useQuery({
        queryKey: ['groups'],
        queryFn: groupService.getGroups
    });

    const createMutation = useMutation({
        mutationFn: groupService.createGroup,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['groups'] });
            toast.success('Grupo creado correctamente');
        },
        onError: () => {
            toast.error('Error creado grupo');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, name }: { id: number; name: string }) =>
            groupService.updateGroup(id, name),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['groups'] });
            toast.success('Grupo actualizado correctamente');
        },
        onError: () => {
            toast.error('Error al actualizar grupo');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: groupService.deleteGroup,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['groups'] });
            toast.success('Grupo eliminado correctamente');
        },
        onError: () => {
            toast.error('Error al eliminar grupo');
        }
    });

    const inviteMutation = useMutation({
        mutationFn: ({ groupId, email }: { groupId: number; email: string }) =>
            groupService.inviteToGroup(groupId, email),
        onSuccess: () => {
            toast.success('Invitación enviada correctamente');
        },
        onError: () => {
            toast.error('Erro al enviar la invitación');
        }
    });

    return {
        groups,
        isLoading,
        createGroup: createMutation.mutateAsync,
        updateGroup: updateMutation.mutateAsync,
        deleteGroup: deleteMutation.mutateAsync,
        inviteToGroup: inviteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isInviting: inviteMutation.isPending
    };
}