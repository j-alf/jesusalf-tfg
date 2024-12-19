export interface OAuthClient {
    id?: number;
    user_id?: number;
    name: string;
    secret: string;
    redirect?: string;
    password_client: boolean;
    revoked: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface OAuthAccessToken {
    id: string;
    user_id?: number;
    client_id: number;
    scopes?: string[];
    revoked: boolean;
    expires_at: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface OAuthRefreshToken {
    id: string;
    access_token_id: string;
    revoked: boolean;
    expires_at: Date;
}