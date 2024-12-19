import {pool} from "../config/database";
import {User} from "../models/user.model";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import bcrypt from "bcryptjs";

export class UserService {
    static async create(user: Omit<User, 'id'>):Promise<ResultSetHeader> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)',
            [user.email, hashedPassword, user.firstName, user.lastName]
        );
        return result;
    }

    static async findByEmail(email: string): Promise<User | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
            [email]
        );
        return rows[0] as User || null;
    }

    static async findById(id: number): Promise<User | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
            [id]
        );
        return rows[0] as User || null;
    }

    static async updateUser(id: number, data: {
        firstName: string;
        lastName: string;
        email: string;
    }): Promise<void> {
        await pool.execute(
            'UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE id = ? AND deleted_at IS NULL',
            [data.firstName, data.lastName, data.email, id]
        );
    }

    static async updatePassword(id: number, hashedPassword: string): Promise<void> {
        await pool.execute(
            'UPDATE users SET password = ? WHERE id = ? AND deleted_at IS NULL',
            [hashedPassword, id]
        );
    }

    static async delete(id: number): Promise<void> {
        await pool.execute(
            'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
            [id]
        );
    }
}