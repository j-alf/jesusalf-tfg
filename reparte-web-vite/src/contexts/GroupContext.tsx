import {ReactNode, useCallback, useMemo, useState} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {groupService} from '../services/groupService';
import {memberService} from '../services/memberService';
import {GroupContext} from '../hooks/useGroups';

export function GroupProvider({children}: Readonly<{ children: ReactNode }>) {
    const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const {
        data: activeGroup,
        isLoading: isLoadingGroup
    } = useQuery({
        queryKey: ['group', activeGroupId],
        queryFn: () => groupService.getGroupDetails(activeGroupId!),
        enabled: !!activeGroupId
    });

    const {
        data: groupMembers = [],
        isLoading: isLoadingMembers
    } = useQuery({
        queryKey: ['members', activeGroupId],
        queryFn: () => memberService.getGroupMembers(activeGroupId!),
        enabled: !!activeGroupId
    });

    const refreshMembers = useCallback(async () => {
        if (activeGroupId) {
            await queryClient.invalidateQueries({queryKey: ['members', activeGroupId]});
        }
    }, [activeGroupId, queryClient]);

    return (
        <GroupContext.Provider
            value={useMemo(() => ({
                activeGroupId,
                setActiveGroupId,
                activeGroup: activeGroup || null,
                groupMembers,
                isLoading: isLoadingGroup || isLoadingMembers,
                refreshMembers
            }), [activeGroupId, setActiveGroupId, activeGroup, groupMembers, isLoadingGroup, isLoadingMembers, refreshMembers])}
        >
            {children}
        </GroupContext.Provider>
    );
}
