import {useEffect, useState} from 'react';
import {Navigate, useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react';
import {PlusIcon} from '@heroicons/react/24/outline';
import {useAuth} from '../hooks/useAuth';
import {groupService} from '../services/groupService';
import {expenseService} from '../services/expenseService';
import {refundService} from '../services/refundService';
import {memberService} from '../services/memberService';
import Layout from '../components/Layout';
import Button from '../components/Button';
import ExpenseList from '../components/expenses/ExpenseList';
import RefundList from '../components/refunds/RefundList';
import ExpenseForm from '../components/expenses/ExpenseForm';
import RefundForm from '../components/refunds/RefundForm';
import Modal from '../components/Modal';
import {TransactionDetails} from "../hooks/useTransaction";
import {useGroup} from "../hooks/useGroups";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function GroupDetails() {
    const {isAuthenticated} = useAuth();
    const {groupId} = useParams<{ groupId: string }>();
    const {setActiveGroupId} = useGroup();
    const queryClient = useQueryClient();
    const [selectedTab, setSelectedTab] = useState(0);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

    const {data: group, isLoading: isLoadingGroup} = useQuery({
        queryKey: ['group', groupId],
        queryFn: () => groupService.getGroupDetails(Number(groupId)),
        enabled: !!groupId
    });

    const {data: expenses, isLoading: isLoadingExpenses} = useQuery({
        queryKey: ['expenses', groupId],
        queryFn: () => expenseService.getGroupExpenses(Number(groupId)),
        enabled: !!groupId
    });

    const {data: refunds, isLoading: isLoadingRefunds} = useQuery({
        queryKey: ['refunds', groupId],
        queryFn: () => refundService.getGroupRefunds(Number(groupId)),
        enabled: !!groupId
    });

    const {data: members, isLoading: isLoadingMembers} = useQuery({
        queryKey: ['members', groupId],
        queryFn: () => memberService.getGroupMembers(Number(groupId)),
        enabled: !!groupId
    });

    const createExpenseMutation = useMutation({
        mutationFn: (data: TransactionDetails) => expenseService.createExpense(Number(groupId), data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['expenses', groupId]});
            setIsExpenseModalOpen(false);
        }
    });

    const createRefundMutation = useMutation({
        mutationFn: (data: TransactionDetails) => refundService.createRefund(Number(groupId), data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['refunds', groupId]});
            setIsRefundModalOpen(false);
        }
    });

    useEffect(() => {
        if (groupId) {
            setActiveGroupId(Number(groupId));
        }
        return () => {
            setActiveGroupId(null);
        };
    }, [groupId, setActiveGroupId]);

    if (!isAuthenticated) {
        return <Navigate to="/login"/>;
    }

    if (isLoadingGroup || isLoadingExpenses || isLoadingRefunds || isLoadingMembers) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-gray-600">Cargando...</div>
                </div>
            </Layout>
        );
    }

    if (!group) {
        return (
            <Layout>
                <div className="bg-white shadow-sm rounded-lg p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Grupo no encontrado</h1>
                    <p className="text-gray-600">No se ha podido encontrar el grupo solicitado.</p>
                </div>
            </Layout>
        );
    }

    const emptyTransaction = {
        groupId: Number(groupId),
        name: '',
        amount: 0,
        type: '',
        description: '',
        paidBy: members?.[0]?.id ?? 0,
        splits: []
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="bg-white shadow-sm rounded-lg p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{group.name}</h1>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Creado el {new Date(group.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                            Código de invitación: {group.invite_code}
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg p-8">
                    <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
                        <div className="flex justify-between items-center mb-6">
                            <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                                <Tab
                                    className={({selected}) =>
                                        classNames(
                                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5 px-6',
                                            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                            selected
                                                ? 'bg-white text-blue-700 shadow'
                                                : 'text-blue-700 hover:bg-white/[0.12] hover:text-blue-800'
                                        )
                                    }
                                >
                                    Gastos
                                </Tab>
                                <Tab
                                    className={({selected}) =>
                                        classNames(
                                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5 px-6',
                                            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                            selected
                                                ? 'bg-white text-blue-700 shadow'
                                                : 'text-blue-700 hover:bg-white/[0.12] hover:text-blue-800'
                                        )
                                    }
                                >
                                    Reembolsos
                                </Tab>
                            </TabList>
                            <Button
                                onClick={() => selectedTab === 0 ? setIsExpenseModalOpen(true) : setIsRefundModalOpen(true)}
                                className="flex items-center"
                            >
                                <PlusIcon className="h-5 w-5 mr-2"/>
                                {selectedTab === 0 ? 'Nuevo Gasto' : 'Nuevo Reembolso'}
                            </Button>
                        </div>
                        <TabPanels>
                            <TabPanel>
                                {expenses && expenses.length > 0 ? (
                                    <ExpenseList expenses={expenses} members={members || []}/>
                                ) : (
                                    <p className="text-gray-600">No se han encontrado gastos.</p>
                                )}
                            </TabPanel>
                            <TabPanel>
                                {refunds && refunds.length > 0 ? (
                                    <RefundList refunds={refunds} members={members || []}/>
                                ) : (
                                    <p className="text-gray-600">No se han encontrado reembolsos.</p>
                                )}
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </div>
            </div>

            <Modal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                title="Crear nuevo gasto"
            >
                <ExpenseForm
                    expense={emptyTransaction}
                    members={members || []}
                    onSubmit={async (data) => {
                        await createExpenseMutation.mutateAsync(data);
                    }}
                    onCancel={() => setIsExpenseModalOpen(false)}
                    isLoading={createExpenseMutation.isPending}
                />
            </Modal>

            <Modal
                isOpen={isRefundModalOpen}
                onClose={() => setIsRefundModalOpen(false)}
                title="Crear nuevo reembolso"
            >
                <RefundForm
                    refund={emptyTransaction}
                    members={members || []}
                    onSubmit={async (data) => {
                        await createRefundMutation.mutateAsync(data);
                    }}
                    onCancel={() => setIsRefundModalOpen(false)}
                    isLoading={createRefundMutation.isPending}
                />
            </Modal>
        </Layout>
    );
}
