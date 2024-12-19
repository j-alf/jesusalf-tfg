import {pool} from '../config/database';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {BalanceService} from "./balance.service";
import {NewTransaction, Split, TransactionDetails, TransactionListItem} from "../models/transaction.model";


export class ExpenseService {
    static async createExpense(expense: NewTransaction): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO expenses (share_group_id, name, amount, type, description, paying_member) VALUES (?, ?, ?, ?, ?, ?)',
            [expense.groupId, expense.name, expense.amount, expense.type, expense.description, expense.paidBy]
        );

        const expenseId = result.insertId;

        for (const split of expense.splits as Split[]) {
            await pool.execute(
                'INSERT INTO expense_splits (expense_id, member_id, amount) VALUES (?, ?, ?)',
                [expenseId, split.memberId, split.amount]
            );
        }

        BalanceService.updateBalances(expense.groupId).catch(err => {
            console.error(`Error updating balances for group ${expense.groupId}:`, err);
        });
        return expenseId;
    }

    static async getExpenseById(expenseId: number): Promise<TransactionDetails | null> {
        const [expenseRows] = await pool.execute<RowDataPacket[]>(
            `SELECT *
             FROM expenses
             WHERE id = ?
               AND deleted_at IS NULL`,
            [expenseId]
        );

        if (expenseRows.length === 0) {
            return null;
        }

        const expense = expenseRows[0];

        const [splitRows] = await pool.execute<RowDataPacket[]>(
            'SELECT member_id, amount FROM expense_splits WHERE expense_id = ? AND deleted_at IS NULL',
            [expenseId]
        );

        return {
            id: expense.id,
            groupId: expense.share_group_id,
            name: expense.name,
            amount: Number(expense.amount),
            type: expense.type,
            description: expense.description,
            paidBy: expense.paying_member,
            splits: splitRows.map(split => ({
                memberId: split.member_id,
                amount: Number(split.amount)
            }))
        };
    }

    static async getExpenses(groupId: number): Promise<TransactionListItem[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT e.id, e.name, e.amount, m.name as paying_name FROM expenses e JOIN members m ON e.paying_member = m.id WHERE e.share_group_id = ? AND e.deleted_at IS NULL AND m.deleted_at IS NULL ORDER BY e.created_at DESC',
            [groupId]
        );
        return rows as TransactionListItem[];
    }

    static async updateExpense(expense: TransactionDetails): Promise<void> {
        await pool.execute(
            'UPDATE expenses SET name = ?, amount = ?, expenses.type = ?, description = ?, paying_member = ? WHERE id = ? AND deleted_at IS NULL',
            [expense.name, expense.amount, expense.type, expense.description, expense.paidBy, expense.id]
        );

        await this.updateExpenseSplits(expense.id, expense.splits);

        BalanceService.updateBalances(expense.groupId).catch(err => {
            console.error(`Error updating balances for group ${expense.groupId}:`, err);
        });
    }

    protected static async updateExpenseSplits(expenseId: number, splits: Split[]): Promise<void> {
        const values: { expense_id: number; member_id: number; amount: number }[] = splits.map((split) => ({
            expense_id: expenseId, member_id: split.memberId, amount: split.amount
        }));
        const splitMemberIds = values.map((value) => value.member_id);

        for (const value of values) {
            await pool.execute(
                `INSERT INTO expense_splits (expense_id, member_id, amount)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE amount     = VALUES(amount),
                                         deleted_at = NULL`,
                [value.expense_id, value.member_id, value.amount]
            );
        }

        if (splitMemberIds.length > 0) {
            const query = `UPDATE expense_splits
                           SET deleted_at = NOW()
                           WHERE expense_id = ?
                             AND member_id NOT IN (${splitMemberIds.join(',')})
                             AND deleted_at IS NULL`;
            await pool.execute(query, [expenseId]);

        }
    }

    static async deleteExpense(expenseId: number, groupId: number): Promise<void> {
        const now = new Date();

        await pool.execute(
            'UPDATE expense_splits SET deleted_at = ? WHERE expense_id = ? AND deleted_at IS NULL',
            [now, expenseId]
        );

        await pool.execute(
            'UPDATE expenses SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL',
            [now, expenseId]
        );

        BalanceService.updateBalances(groupId).catch(err => {
            console.error(`Error updating balances for group ${groupId}:`, err);
        });
    }
}