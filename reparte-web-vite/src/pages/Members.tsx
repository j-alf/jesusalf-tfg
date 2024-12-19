import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useMutation} from '@tanstack/react-query';
import {toast} from 'react-hot-toast';
import {PlusIcon} from '@heroicons/react/24/outline';
import {useGroup} from '../hooks/useGroups';
import {memberService} from '../services/memberService';
import Layout from '../components/Layout';
import Button from '../components/Button';
import MemberList from '../components/members/MemberList';
import AddMemberForm from '../components/members/AddMemberForm';

export default function Members() {
    const {groupId} = useParams<{ groupId: string }>();
    const {setActiveGroupId, activeGroup, groupMembers, isLoading, refreshMembers} = useGroup();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        if (groupId) {
            setActiveGroupId(Number(groupId));
        }
        return () => {
            setActiveGroupId(null);
        };
    }, [groupId, setActiveGroupId]);

    const createMutation = useMutation({
        mutationFn: (name: string) =>
            memberService.createMember(Number(groupId), name),
        onSuccess: async () => {
            await refreshMembers();
            toast.success('Miembro añadido correctamente');
        },
        onError: () => {
            toast.error('Error al añadir nuevo miembro');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({memberId, name}: { memberId: number; name: string }) =>
            memberService.updateMember(Number(groupId), memberId, name),
        onSuccess: async () => {
            await refreshMembers();
            toast.success('Miembro actualizado correctamente');
        },
        onError: () => {
            toast.error('Error al actualizar miembro');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (memberId: number) =>
            memberService.deleteMember(Number(groupId), memberId),
        onSuccess: async () => {
            await refreshMembers();
            toast.success('Miembro eliminado correctamente');
        },
        onError: () => {
            toast.error('Error al eliminar miembro');
        }
    });

    if (isLoading) {
        return (
            <Layout>
                <div className="text-center">Cargando...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="bg-white shadow-sm rounded-lg p-8">
                    <h1 className="text-2xl font-bold text-gray-900">{activeGroup?.name}</h1>
                </div>

                <div className="bg-white shadow-sm rounded-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Miembros</h2>
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center"
                        >
                            <PlusIcon className="h-5 w-5 mr-2"/>
                            Añadir Miembro
                        </Button>
                    </div>

                    <MemberList
                        members={groupMembers}
                        onUpdate={async (memberId, name) => {
                            await updateMutation.mutateAsync({memberId, name});
                        }}
                        onDelete={async (memberId) => {
                            await deleteMutation.mutateAsync(memberId);
                        }}
                        isUpdating={updateMutation.isPending}
                        isDeleting={deleteMutation.isPending}
                    />
                </div>

                <AddMemberForm
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={async (name) => {
                        await createMutation.mutateAsync(name);
                    }}
                    isLoading={createMutation.isPending}
                />
            </div>
        </Layout>
    );
}
