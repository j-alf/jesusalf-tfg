export interface Member {
    id: number;
    name: string;
    user_id: number | null;
    share_group_id: number;
    is_creator: boolean;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
