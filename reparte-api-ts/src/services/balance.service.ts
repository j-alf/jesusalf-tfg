import {pool} from '../config/database';
import {RowDataPacket} from 'mysql2';
import {Balance} from "../models/balance.model";
import {MemberService} from "./member.service";

export class BalanceService {
    static async getBalances(groupId: number): Promise<Balance[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT m.id as member_id,
                    m.name,
                    m.user_id,
                    b.total_paid,
                    b.total_owed,
                    b.net_balance
             FROM members m
                      JOIN balances b ON m.id = b.member_id
             WHERE m.share_group_id = ?
               AND m.deleted_at IS NULL
             ORDER BY b.net_balance DESC`,
            [groupId]
        );

        return rows.map(row => ({
            memberId: row.member_id,
            name: row.name,
            userId: row.user_id,
            totalPaid: Number(row.total_paid),
            totalOwed: Number(row.total_owed),
            netBalance: Number(row.net_balance)
        }));
    }

    static async updateBalances(groupId: number): Promise<void> {
        const members = await MemberService.getMembers(groupId);

        for (const member of members) {
            await this.updateMemberBalance(groupId, member.id);
        }
    }

    protected static async updateMemberBalance(groupId: number, memberId: number): Promise<void> {
        const [expenses] = await pool.execute<RowDataPacket[]>(
            'SELECT paying_member AS member_id, COALESCE(SUM(amount), 0) AS paid FROM expenses WHERE paying_member = ? AND deleted_at IS NULL GROUP BY paying_member;',
            [memberId]
        );

        const [expensesSplits] = await pool.execute<RowDataPacket[]>(
            'SELECT member_id, COALESCE(SUM(amount), 0) AS owed FROM expense_splits WHERE member_id = ? AND deleted_at IS NULL GROUP BY member_id;',
            [memberId]
        );

        const [refunds] = await pool.execute<RowDataPacket[]>(
            'SELECT paying_member AS member_id, COALESCE(SUM(amount), 0) AS paid FROM refunds WHERE paying_member = ? AND deleted_at IS NULL GROUP BY paying_member;',
            [memberId]
        );

        const [refundsSplits] = await pool.execute<RowDataPacket[]>(
            'SELECT member_id, COALESCE(SUM(amount), 0) AS income FROM refund_splits WHERE member_id = ? AND deleted_at IS NULL GROUP BY member_id;',
            [memberId]
        );

        const exPaid = expenses.length > 0 ? Number(expenses[0].paid) : 0;
        const exOwed = expensesSplits.length > 0 ? Number(expensesSplits[0].owed) : 0;
        const rePaid = refunds.length > 0 ? Number(refunds[0].paid) : 0;
        const reIncome = refundsSplits.length > 0 ? Number(refundsSplits[0].income) : 0;

        const totalPaid = exPaid - reIncome;
        const totalOwed = exOwed - rePaid;
        const netBalance = totalPaid - totalOwed;

        await pool.execute(
            `INSERT INTO balances (member_id, share_group_id, total_paid, total_owed, net_balance)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE total_paid  = VALUES(total_paid),
                                     total_owed  = VALUES(total_owed),
                                     net_balance = VALUES(net_balance)`,
            [memberId, groupId, totalPaid, totalOwed, netBalance]
        );
    }
}