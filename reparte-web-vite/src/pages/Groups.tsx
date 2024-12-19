import {useState} from 'react';
import Layout from '../components/Layout';
import GroupHeader from '../components/groups/GroupHeader';
import GroupList from '../components/groups/GroupList.tsx';
import GroupForm from '../components/groups/GroupForm';
import InviteModal from '../components/groups/InviteModal';
import {Group} from '../services/groupService';
import {useGroups} from '../hooks/useGroups';
import {UserGroupIcon} from '@heroicons/react/24/outline';

export default function Groups() {
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const {
        groups,
        isLoading,
        createGroup,
        updateGroup,
        deleteGroup,
        inviteToGroup,
        isCreating,
        isUpdating,
        isInviting
    } = useGroups();

    const handleGroupSubmit = async (name: string) => {
        if (selectedGroup) {
            await updateGroup({id: selectedGroup.id, name});
        } else {
            await createGroup(name);
        }
        setIsGroupModalOpen(false);
        setSelectedGroup(null);
    };

    const handleInviteSubmit = async (email: string) => {
        if (selectedGroup) {
            await inviteToGroup({groupId: selectedGroup.id, email});
            setIsInviteModalOpen(false);
            setSelectedGroup(null);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="text-center">Cargando...</div>
            </Layout>
        );
    }

    const showWelcomeMessage = groups.length === 0;

    return (
        <Layout>
            <div className="space-y-6">
                <GroupHeader onCreateClick={() => {
                    setSelectedGroup(null);
                    setIsGroupModalOpen(true);
                }}/>

                {showWelcomeMessage ? (
                    <div className="text-center py-12">
                        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400"/>
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">¡Bienvenido a la gestión de gastos grupales!</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Aún no tienes ningún grupo creado. Comienza organizando tus gastos compartidos de manera sencilla.
                        </p>
                        <p className="mt-1 text-sm font-medium text-blue-600">
                            ¡Y no te olvides, ReparTe con quien desees!
                        </p>
                    </div>
                ) : (
                    <GroupList
                        groups={groups}
                        onEdit={(group) => {
                            setSelectedGroup(group);
                            setIsGroupModalOpen(true);
                        }}
                        onDelete={(group) => deleteGroup(group.id)}
                        onInvite={(group) => {
                            setSelectedGroup(group);
                            setIsInviteModalOpen(true);
                        }}
                    />
                )}

                <GroupForm
                    isOpen={isGroupModalOpen}
                    onClose={() => {
                        setIsGroupModalOpen(false);
                        setSelectedGroup(null);
                    }}
                    onSubmit={handleGroupSubmit}
                    group={selectedGroup}
                    isLoading={isCreating || isUpdating}
                />

                {selectedGroup && (
                    <InviteModal
                        isOpen={isInviteModalOpen}
                        onClose={() => {
                            setIsInviteModalOpen(false);
                            setSelectedGroup(null);
                        }}
                        onSubmit={handleInviteSubmit}
                        group={selectedGroup}
                        isLoading={isInviting}
                    />
                )}
            </div>
        </Layout>
    );
}
