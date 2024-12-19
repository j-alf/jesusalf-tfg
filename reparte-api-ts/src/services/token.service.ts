import {pool} from '../config/database';
import {OAuthAccessToken, OAuthClient, OAuthRefreshToken} from '../models/oauth.model';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export class TokenService {
    private static readonly ACCESS_TOKEN_EXPIRY = 15;
    private static readonly REFRESH_TOKEN_EXPIRY = 30;

    static async createClient(name: string, userId?: number, isPassword = false): Promise<OAuthClient> {
        const secret = crypto.randomBytes(32).toString('hex');

        const [result] = await pool.execute(
            `INSERT INTO oauth_clients(name, user_id, secret, password_client)
             VALUES (?, ?, ?, ?)`,
            [name, userId ?? null, secret, isPassword]
        );

        return {
            id: (result as any).insertId,
            name,
            user_id: userId,
            secret,
            password_client: isPassword,
            revoked: false
        };
    }

    static async createAccessToken(userId: number, clientId: number, scopes: string[] = ['*']): Promise<OAuthAccessToken> {
        const tokenId = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + this.ACCESS_TOKEN_EXPIRY);

        const accessToken: OAuthAccessToken = {
            id: tokenId,
            user_id: userId,
            client_id: clientId,
            scopes,
            revoked: false,
            expires_at: expiresAt
        };

        await pool.execute(
            `INSERT INTO oauth_access_tokens(id, user_id, client_id, scopes, expires_at)
             VALUES (?, ?, ?, ?, ?)`,
            [accessToken.id, accessToken.user_id, accessToken.client_id, JSON.stringify(accessToken.scopes), accessToken.expires_at]
        );

        return accessToken;
    }

    static async createRefreshToken(accessTokenId: string): Promise<OAuthRefreshToken> {
        const tokenId = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date;
        expiresAt.setMinutes(expiresAt.getMinutes() + this.REFRESH_TOKEN_EXPIRY);

        const refreshToken: OAuthRefreshToken = {
            id: tokenId,
            access_token_id: accessTokenId,
            revoked: false,
            expires_at: expiresAt
        };

        await pool.execute(
            `INSERT INTO oauth_refresh_tokens(id, access_token_id, expires_at)
             VALUES (?, ?, ?)`,
            [refreshToken.id, refreshToken.access_token_id, refreshToken.expires_at]
        );

        return refreshToken;
    }

    static generateJWT(accessToken: OAuthAccessToken): string {
        return jwt.sign(
            {
                userId: accessToken.user_id,
                accessToken: accessToken.id,
                clientId: accessToken.client_id,
                scopes: accessToken.scopes
            },
            process.env.JWT_SECRET!
        );
    }

    static async getAccessTokenByRefreshToken(refreshTokenId: string): Promise<OAuthAccessToken | null> {
        const [tokens] = await pool.execute(
            `SELECT at.*
             FROM oauth_access_tokens at
                      INNER JOIN oauth_refresh_tokens rt ON rt.access_token_id = at.id
             WHERE rt.id = ?`,
            [refreshTokenId]
        );

        return (tokens as OAuthAccessToken[])[0] || null;
    }

    static async getRefreshTokenByAccessToken(accessTokenId: string): Promise<OAuthRefreshToken | null> {
        const [refreshToken] = await pool.execute(
            `SELECT id
             FROM oauth_refresh_tokens
             WHERE access_token_id = ?
               AND revoked = FALSE
               AND deleted_at IS NULL`, [accessTokenId]
        );

        return (refreshToken as OAuthRefreshToken[])[0] || null;
    }
}