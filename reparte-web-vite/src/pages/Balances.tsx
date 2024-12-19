import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react';
import {balanceService, Settlement} from '../services/balanceService';
import {useGroup} from '../hooks/useGroups';
import Layout from '../components/Layout';
import Card from '../components/Card';
import BalanceList from '../components/balances/BalanceList';
import SettlementList from '../components/balances/SettlementList';
import {refundService} from '../services/refundService';
import {toast} from 'react-hot-toast';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Balances() {
    const {groupId} = useParams<{ groupId: string }>();
    const {setActiveGroupId, activeGroup} = useGroup();
    const [selectedTab, setSelectedTab] = useState(0);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (groupId) {
            setActiveGroupId(Number(groupId));
        }
        return () => {
            setActiveGroupId(null);
        };
    }, [groupId, setActiveGroupId]);

    const {data: balances, isLoading} = useQuery({
        queryKey: ['balances', groupId],
        queryFn: () => balanceService.getGroupBalances(Number(groupId)),
        enabled: !!groupId
    });

    const createRefundMutation = useMutation({
        mutationFn: async (settlement: Settlement) => {
            const refundData = {
                groupId: Number(groupId),
                name: `Reembolso`,
                amount: settlement.amount,
                type: 'Transferencia',
                description: `Reembolso sugerido de ${settlement.fromMemberName} a ${settlement.toMemberName}`,
                paidBy: settlement.fromMemberId,
                splits: [{
                    memberId: settlement.toMemberId,
                    amount: settlement.amount
                }]
            };
            await refundService.createRefund(Number(groupId), refundData);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['balances', groupId]});
            toast.success('Reembolso completado');
        },
        onError: () => {
            toast.error('Error al completar reembolso');
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
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Balances</h2>
                    <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
                        <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                            <Tab
                                className={({selected}) =>
                                    classNames(
                                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                        selected
                                            ? 'bg-white text-blue-700 shadow'
                                            : 'text-blue-700 hover:bg-white/[0.12] hover:text-blue-800'
                                    )
                                }
                            >
                                Balances
                            </Tab>
                            <Tab
                                className={({selected}) =>
                                    classNames(
                                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                        selected
                                            ? 'bg-white text-blue-700 shadow'
                                            : 'text-blue-700 hover:bg-white/[0.12] hover:text-blue-800'
                                    )
                                }
                            >
                                Liquidaciones sugeridas
                            </Tab>
                        </TabList>
                        <TabPanels className="mt-4">
                            <TabPanel>
                                <Card>
                                    {balances && <BalanceList balances={balances.memberBalances}/>}
                                </Card>
                            </TabPanel>
                            <TabPanel>
                                <Card>
                                    {balances && (
                                        <SettlementList
                                            settlements={balances.settlements}
                                            setAsRefund={settlement => createRefundMutation.mutateAsync(settlement)}
                                            isSettingRefund={createRefundMutation.isPending}
                                        />
                                    )}
                                </Card>
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </div>
            </div>
        </Layout>
    );
}