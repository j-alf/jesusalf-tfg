import {Balance, Settlement} from "../models/balance.model";
import {BalanceService} from "../services/balance.service";
import {MemberService} from "../services/member.service";

export class BalanceUtils {
    static async calculateBalances(groupId: number): Promise<{
        memberBalances: Balance[];
        settlements: Settlement[];
    }> {
        // await BalanceService.updateBalances(groupId);
        const memberBalances = await BalanceService.getBalances(groupId);
        const settlements = this.calculateOptimalSettlements(memberBalances);

        return {
            memberBalances,
            settlements
        };
    }

    private static calculateOptimalSettlements(balances: Balance[]): Settlement[] {
        const settlements: Settlement[] = [];
        const debtors = balances.filter(b => b.netBalance < 0)
            .map(b => ({...b}))
            .sort((a, b) => a.netBalance - b.netBalance);
        const creditors = balances.filter(b => b.netBalance > 0)
            .map(b => ({...b}))
            .sort((a, b) => b.netBalance - a.netBalance);

        let debtorIdx = 0;
        let creditorIdx = 0;

        while (debtorIdx < debtors.length && creditorIdx < creditors.length) {
            const debtor = debtors[debtorIdx];
            const creditor = creditors[creditorIdx];

            const amount = Math.min(
                Math.abs(debtor.netBalance),
                creditor.netBalance
            );

            if (amount > 0.01) {
                settlements.push({
                    fromMemberId: debtor.memberId,
                    fromMemberName: debtor.name,
                    toMemberId: creditor.memberId,
                    toMemberName: creditor.name,
                    amount: Number(amount.toFixed(2))
                });

                debtor.netBalance += amount;
                creditor.netBalance -= amount;
            }

            if (Math.abs(debtor.netBalance) < 0.01) debtorIdx++;
            if (Math.abs(creditor.netBalance) < 0.01) creditorIdx++;
        }

        return settlements;
    }

    static validateTotalSplits(amount: number, splits: { amount: number }[]): boolean {
        const totalSplit = splits.reduce((sum, split) => sum + split.amount, 0);
        return Math.abs(amount - totalSplit) < 0.01;
    }

    static async validateMembersSplits(groupId: number, paidBy: number, splits: {
        memberId: number
    }[]): Promise<boolean> {
        const groupMembers = await MemberService.getMembers(groupId);
        const groupMemberIds = new Set(groupMembers.map(member => member.id));

        const allSplitsValid = splits.every(split => groupMemberIds.has(split.memberId));
        const isPaidByValid = groupMemberIds.has(paidBy);

        return allSplitsValid && isPaidByValid;

        /*const groupMembers = await MemberService.getMembers(groupId);
        const groupMemberIds = groupMembers.map(member => member.id);

        return splits.every(split => groupMemberIds.includes(split.member_id));*/

    }
}
