export interface Group {
    id?: number;
    name: string;
    creator_user: number;
    invite_code?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
