import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useMutation, useQuery} from '@tanstack/react-query';
import {toast} from 'react-hot-toast';
import {groupService} from '../services/groupService';
import {memberService} from '../services/memberService';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import {UserGroupIcon, CheckCircleIcon} from '@heroicons/react/24/outline';

interface PendingMember {
    id: number;
    name: string;
    user_id: number | null;
}

export default function JoinGroup() {
    const {inviteCode} = useParams<{ inviteCode: string }>();
    const navigate = useNavigate();
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

    const {data: groupData, isLoading, refetch} = useQuery({
        queryKey: ['group-invite', inviteCode],
        queryFn: () => groupService.getGroupByInviteCode(inviteCode!),
        enabled: !!inviteCode,
        retry: 1
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                await refetch();
            } catch (error) {
                console.error('Error al obtener los datos del grupo:', error);
            }
        };
        fetchData().catch(error => {
            console.error('Error en la obtención de datos del grupo:', error);
        });
    }, [refetch]);

    const joinMutation = useMutation({
        mutationFn: (memberId: number) => memberService.associateUserMember(memberId),
        onSuccess: () => {
            toast.success('¡Se ha unido al grupo correctamente!');
            if (groupData?.group.id) {
                navigate(`/groups/${groupData.group.id}`);
            } else {
                navigate('/groups');
            }
        },
        onError: () => {
            toast.error('Error al unirse al grupo, puede que ya seas miembro.');
        }
    });

    const handleJoin = async () => {
        if (!selectedMemberId) {
            toast.error('Selecciona un miembro para continuar');
            return;
        }
        await joinMutation.mutateAsync(selectedMemberId);
    };

    const handleMemberSelect = (memberId: number) => {
        setSelectedMemberId(memberId);
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-gray-600">Cargando...</div>
                </div>
            </Layout>
        );
    }

    if (!groupData) {
        return (
            <Layout>
                <Card>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900">Enlace de invitación incorrecto</h2>
                        <p className="mt-2 text-gray-600">Este enlace de invitación no es válido o ha expirado.</p>
                    </div>
                </Card>
            </Layout>
        );
    }

    const availableMembers = groupData.members.filter(
        (member: PendingMember) => !member.user_id
    );

    if (availableMembers.length === 0) {
        return (
            <Layout>
                <Card>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900">No hay miembros disponibles</h2>
                        <p className="mt-2 text-gray-600">
                            Todos los miembros de este grupo ya están asociados a otros usuarios.
                        </p>
                    </div>
                </Card>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <Card>
                    <div className="text-center mb-6">
                        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400"/>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">
                            Grupo: {groupData.group.name}
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Seleccione su nombre de la siguiente lista para unirse al grupo
                        </p>
                    </div>

                    <div
                        className="space-y-4"
                        role="radiogroup"
                        aria-label="Selecciona tu perfil de miembro"
                    >
                        {availableMembers.map((member: PendingMember) => (
                            <label
                                key={member.id}
                                className={`
                                flex items-center justify-between p-4 rounded-lg border-2 transition-colors focus:outline-none 
                                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                ${selectedMemberId === member.id 
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-200'}
                               `}
                            >
                                <input
                                    type="radio"
                                    name="member-profile"
                                    value={member.id}
                                    checked={selectedMemberId === member.id}
                                    onChange={() => handleMemberSelect(member.id)}
                                    className="sr-only"
                                />
                                <h3 className="font-medium text-gray-900">{member.name}</h3>
                                {selectedMemberId === member.id && (
                                    <CheckCircleIcon className="h-6 w-6 text-blue-500"/>
                                )}
                            </label>
                        ))}
                    </div>

                    <div className="mt-6">
                        <Button
                            onClick={handleJoin}
                            className="w-full"
                            isLoading={joinMutation.isPending}
                            disabled={!selectedMemberId}
                        >
                            Unirse
                        </Button>
                    </div>
                </Card>
            </div>
        </Layout>
    );
}
