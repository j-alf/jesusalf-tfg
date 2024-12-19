export interface User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}