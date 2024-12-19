import {pool} from '../config/database';
import {OAuthAccessToken, OAuthClient, OAuthRefreshToken} from '../models/oauth.model';

export class OAuthService {

    static async validateClientCredentials(clientId: number, clientSecret: string) {
        const [clients] = await pool.execute(
            'SELECT * FROM oauth_clients WHERE id = ? AND secret = ? AND revoked = FALSE',
            [clientId, clientSecret]
        );
        return (clients as OAuthClient[]).length > 0;
    }

    static async verifyAccessToken(tokenId: string): Promise<OAuthAccessToken | null> {
        const [tokens] = await pool.execute(
            `SELECT *
             FROM oauth_access_tokens
             WHERE id = ?
               AND revoked = FALSE
               AND expires_at > NOW()`,
            [tokenId]
        );

        return (tokens as OAuthAccessToken[])[0] || null;
    }

    static async verifyRefreshToken(tokenId: string): Promise<OAuthRefreshToken | null> {
        const [tokens] = await pool.execute(
            `SELECT *
             FROM oauth_refresh_tokens
             WHERE id = ?
               AND revoked = FALSE
               AND expires_at > NOW()`,
            [tokenId]
        );

        return (tokens as OAuthRefreshToken[])[0] || null;
    }

    static async revokeAccessToken(tokenId: string): Promise<void> {
        await pool.execute(
            'UPDATE oauth_access_tokens SET revoked = TRUE WHERE id = ?',
            [tokenId]
        );
    }

    static async revokeRefreshToken(tokenId: string): Promise<void> {
        await pool.execute(
            'UPDATE oauth_refresh_tokens SET revoked = TRUE WHERE id = ?',
            [tokenId]
        );
    }
}