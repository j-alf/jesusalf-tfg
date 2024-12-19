import {pool} from '../config/database';
import {RowDataPacket} from 'mysql2';
import {Member} from "../models/member.model";

export class MemberService {

    static async getMemberIdByUserId(groupId: number, userId: number): Promise<number | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM members WHERE share_group_id = ? AND user_id = ? AND deleted_at IS NULL',
            [groupId, userId]
        );
        return rows[0]?.id || null;
    }

    static async isGroupCreator(groupId: number, memberId: number): Promise<boolean> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT is_creator FROM members WHERE share_group_id = ? AND id = ? AND deleted_at IS NULL',
            [groupId, memberId]
        );
        return rows[0]?.is_creator === 1;
    }

    static async getMembers(groupId: number): Promise<Member[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM members WHERE share_group_id = ? AND deleted_at IS NULL ORDER BY created_at',
            [groupId]
        );
        return rows as Member[];
    }

    static async getMemberById(memberId: number): Promise<Member | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM members WHERE id = ? AND deleted_at IS NULL',
            [memberId]
        );
        return rows[0] as Member || null;
    }

    static async addMember(groupId: number, memberName: string, creatorUser: number): Promise<void> {
        await pool.execute(
            'INSERT INTO members (share_group_id, name, creator_user) VALUES (?, ?, ?)',
            [groupId, memberName, creatorUser]
        );
    }

    static async updateMember(groupId: number, memberId: number, data: { memberName: string }): Promise<void> {
        await pool.execute(
            'UPDATE members SET name = ? WHERE id = ? AND share_group_id = ? AND deleted_at IS NULL',
            [data.memberName, memberId, groupId]
        );
    }

    static async deleteMember(groupId: number, memberId: number): Promise<void> {
        const now = new Date();

        const [expenses] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM expenses WHERE share_group_id = ? AND paying_member = ? AND deleted_at IS NULL',
            [groupId, memberId]
        );
        const [refunds] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM refunds WHERE share_group_id = ? AND paying_member = ? AND deleted_at IS NULL',
            [groupId, memberId]
        );

        if (expenses.length > 0 || refunds.length > 0) {
            throw new Error('Cannot remove member with existing expenses or refunds. Please reassign or delete their expenses or refunds first.');
        }

        await pool.execute(
            'UPDATE expense_splits es JOIN expenses e ON es.expense_id = e.id SET es.deleted_at = ? WHERE e.share_group_id = ? AND es.member_id = ? AND es.deleted_at IS NULL',
            [now, groupId, memberId]
        );

        await pool.execute(
            'UPDATE refund_splits es JOIN refunds r ON es.refund_id = r.id SET es.deleted_at = ? WHERE r.share_group_id = ? AND es.member_id = ? AND es.deleted_at IS NULL',
            [now, groupId, memberId]
        );

        await pool.execute(
            'UPDATE members SET deleted_at = ? WHERE share_group_id = ? AND id = ? AND deleted_at IS NULL',
            [now, groupId, memberId]
        );
    }

    static async associateUserMembership(memberId: number, userId: number): Promise<void> {
        await pool.execute(
            'UPDATE members SET user_id = ? WHERE id = ? AND deleted_at IS NULL',
            [userId, memberId]
        );
    }
}