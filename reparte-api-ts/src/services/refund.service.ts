import {pool} from '../config/database';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {NewTransaction, Split, TransactionDetails, TransactionListItem} from '../models/transaction.model';
import {BalanceService} from './balance.service';

export class RefundService {
    static async getRefunds(groupId: number): Promise<TransactionListItem[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT e.id, e.name, e.amount, m.name as paying_name FROM refunds e JOIN members m ON e.paying_member = m.id WHERE e.share_group_id = ? AND e.deleted_at IS NULL AND m.deleted_at IS NULL ORDER BY e.created_at DESC',
            [groupId]
        );
        return rows as TransactionListItem[];
    }

    static async getRefundById(refundId: number): Promise<TransactionDetails | null> {
        const [refundRows] = await pool.execute<RowDataPacket[]>(
            `SELECT *
             FROM refunds
             WHERE id = ?
               AND deleted_at IS NULL`,
            [refundId]
        );

        if (refundRows.length === 0) {
            return null;
        }

        const refund = refundRows[0];

        const [splitRows] = await pool.execute<RowDataPacket[]>(
            'SELECT member_id, amount FROM refund_splits WHERE refund_id = ? AND deleted_at IS NULL',
            [refundId]
        );

        return {
            id: refund.id,
            groupId: refund.share_group_id,
            name: refund.name,
            amount: Number(refund.amount),
            type: refund.type,
            description: refund.description,
            paidBy: refund.paying_member,
            splits: splitRows.map(split => ({
                memberId: split.member_id,
                amount: Number(split.amount)
            }))
        };
    }

    static async createRefund(refund: NewTransaction): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO refunds (share_group_id, name, amount, type, description, paying_member) VALUES (?, ?, ?, ?, ?, ?)',
            [refund.groupId, refund.name, refund.amount, refund.type, refund.description, refund.paidBy]
        );

        const refundId = result.insertId;

        for (const split of refund.splits as Split[]) {
            await pool.execute(
                'INSERT INTO refund_splits (refund_id, member_id, amount) VALUES (?, ?, ?)',
                [refundId, split.memberId, split.amount]
            );
        }

        BalanceService.updateBalances(refund.groupId).catch(err => {
            console.error(`Error updating balances for group ${refund.groupId}:`, err);
        });
        return refundId;
    }

    static async updateRefund(refund: TransactionDetails): Promise<void> {
        await pool.execute(
            'UPDATE refunds SET name = ?, amount = ?, refunds.type = ?, description = ?, paying_member = ? WHERE id = ? AND deleted_at IS NULL',
            [refund.name, refund.amount, refund.type, refund.description, refund.paidBy, refund.id]
        );

        await this.updateRefundSplits(refund.id, refund.splits);

        BalanceService.updateBalances(refund.groupId).catch(err => {
            console.error(`Error updating balances for group ${refund.groupId}:`, err);
        });
    }

    protected static async updateRefundSplits(refundId: number, splits: Split[]): Promise<void> {
        const values: { refund_id: number; member_id: number; amount: number }[] = splits.map((split) => ({
            refund_id: refundId, member_id: split.memberId, amount: split.amount
        }));
        const splitMemberIds = values.map((value) => value.member_id);

        for (const value of values) {
            await pool.execute(
                `INSERT INTO refund_splits (refund_id, member_id, amount)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE amount     = VALUES(amount),
                                         deleted_at = NULL`,
                [value.refund_id, value.member_id, value.amount]
            );
        }

        if (splitMemberIds.length > 0) {
            const query = `UPDATE refund_splits
                           SET deleted_at = NOW()
                           WHERE refund_id = ?
                             AND member_id NOT IN (${splitMemberIds.join(',')})
                             AND deleted_at IS NULL`;
            await pool.execute(query, [refundId]);
        }
    }

    static async deleteRefund(refundId: number, groupId: number): Promise<void> {
        const now = new Date();

        await pool.execute(
            'UPDATE refund_splits SET deleted_at = ? WHERE refund_id = ? AND deleted_at IS NULL',
            [now, refundId]
        );

        await pool.execute(
            'UPDATE refunds SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL',
            [now, refundId]
        );

        BalanceService.updateBalances(groupId).catch(err => {
            console.error(`Error updating balances for group ${groupId}:`, err);
        });
    }
}