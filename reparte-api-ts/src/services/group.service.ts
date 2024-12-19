import {pool} from '../config/database';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {v4} from 'uuid';
import {Group} from "../models/group.model";

export class GroupService {
    static async createGroup(group: Omit<Group, 'id' | 'invite_code'>, creatorName: string): Promise<number> {
        const inviteCode = v4();
        const [groupResult] = await pool.execute<ResultSetHeader>(
            'INSERT INTO share_groups (name, creator_user, invite_code) VALUES (?, ?, ?)',
            [group.name, group.creator_user, inviteCode]
        );

        await pool.execute(
            'INSERT INTO members (share_group_id, name, user_id, is_creator, creator_user) VALUES (?, ?, ?, TRUE, ?)',
            [groupResult.insertId, creatorName, group.creator_user, group.creator_user]
        );

        return groupResult.insertId;
    }

    static async findGroupByUserId(userId: number): Promise<Group[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT g.* FROM share_groups g JOIN members m ON g.id = m.share_group_id WHERE m.user_id = ? AND g.deleted_at IS NULL AND m.deleted_at IS NULL',
            [userId]
        );
        return rows as Group[];
    }

    static async findGroupById(id: number): Promise<Group | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM share_groups WHERE id = ? AND deleted_at IS NULL',
            [id]
        );
        return rows[0] as Group || null;
    }

    static async findGroupByInviteCode(inviteCode: string): Promise<Group | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM share_groups WHERE invite_code = ? AND deleted_at IS NULL',
            [inviteCode]
        );
        return rows[0] as Group || null;
    }

    static async updateGroup(groupId: number, data: Partial<Group>): Promise<void> {
        const fields = Object.keys(data)
            .filter(key => key !== 'id' && key !== 'invite_code')
            .map(key => `${key} = ?`);

        const values = Object.values(data);

        if (fields.length > 0) {
            await pool.execute(
                `UPDATE share_groups
                 SET ${fields.join(', ')}
                 WHERE id = ?
                   AND deleted_at IS NULL`,
                [...values, groupId]
            );
        }
    }

    static async deleteGroup(groupId: number): Promise<void> {
        const now = new Date();

        await pool.execute(
            'UPDATE expense_splits es JOIN expenses e ON es.expense_id = e.id SET es.deleted_at = ? WHERE e.share_group_id = ? AND es.deleted_at IS NULL',
            [now, groupId]
        );

        await pool.execute(
            'UPDATE refund_splits es JOIN refunds r ON es.refund_id = r.id SET es.deleted_at = ? WHERE r.share_group_id = ? AND es.deleted_at IS NULL',
            [now, groupId]
        );

        await pool.execute(
            'UPDATE expenses SET deleted_at = ? WHERE share_group_id = ? AND deleted_at IS NULL',
            [now, groupId]
        );

        await pool.execute(
            'UPDATE refunds SET deleted_at = ? WHERE share_group_id = ? AND deleted_at IS NULL',
            [now, groupId]
        );

        await pool.execute(
            'UPDATE members SET deleted_at = ? WHERE share_group_id = ? AND deleted_at IS NULL',
            [now, groupId]
        );

        await pool.execute(
            'UPDATE share_groups SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL',
            [now, groupId]
        );
    }
}