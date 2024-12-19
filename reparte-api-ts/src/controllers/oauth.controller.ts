import {Request, Response} from 'express';
import {OAuthService} from '../services/oauth.service';
import {TokenService} from '../services/token.service';
import {pool} from '../config/database';
import bcrypt from 'bcryptjs';
import {User} from "../models/user.model";
import {TokenInput, validateToken} from "../schemas/token.schema";
import {
    LoginInput,
    RefreshInput,
    RegisterInput,
    validateLogin,
    validateRefresh,
    validateRegister
} from "../schemas/oauth.schema";
import {UserService} from "../services/user.service";

export class OAuthController {
    static async token(req: Request, res: Response) {
        try {

            const validation = validateToken(req.body);
            if (!validation.success) {
                res.status(400).json({errors: validation.error.errors});
                return;
            }

            // Validate client credentials
            if (!await OAuthController.handleValidateClient(req.body, res)) return;

            const {grant_type} = req.body;

            if (grant_type === 'password') {
                await OAuthController.handlePasswordGrant(req.body, res);
                return;
            }

            if (grant_type === 'refresh_token') {
                await OAuthController.handleRefreshTokenGrant(req.body, res);
                return;
            }

            res.status(400).json({message: 'Invalid grant type'});

        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Server error'});
        }
    }

    private static async handleValidateClient({client_id, client_secret}: TokenInput, res: Response) {
        const isValidClient = await OAuthService.validateClientCredentials(client_id, client_secret);
        if (!isValidClient) {
            res.status(401).json({message: 'Invalid client credentials'});
            return false;
        }
        return true;
    }

    private static async handlePasswordGrant({email, password, client_id, scope}: LoginInput, res: Response) {
        const validation = validateLogin({email, password, client_id, scope});

        if (!validation.success) {
            res.status(400).json({
                errors: validation.error.errors
            });
            return;
        }

        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = (users as User[])[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(400).json({message: 'Invalid user or credentials'});
            return;
        }

        const scopes = scope ? scope.split(' ') : ['*'];
        const accessToken = await TokenService.createAccessToken(user.id, client_id, scopes);
        const refreshToken = await TokenService.createRefreshToken(accessToken.id);

        res.json({
            access_token: TokenService.generateJWT(accessToken),
            token_type: 'Bearer',
            expires_in: Math.floor((accessToken.expires_at.getTime() - Date.now()) / 1000),
            refresh_token: refreshToken.id,
            scope: scopes.join(' '),
        });
    }

    private static async handleRefreshTokenGrant({refresh_token, client_id}: RefreshInput, res: Response) {
        const validation = validateRefresh({refresh_token, client_id});
        if (!validation.success) {
            res.status(400).json({
                errors: validation.error.errors
            });
            return;
        }

        const existingRefreshToken = await OAuthService.verifyRefreshToken(refresh_token);
        if (!existingRefreshToken) {
            res.status(400).json({message: 'Invalid refresh token'});
            return;
        }

        const oldAccessToken = await TokenService.getAccessTokenByRefreshToken(refresh_token);
        if (!oldAccessToken) {
            res.status(400).json({message: 'Invalid refresh token'});
            return;
        }

        await OAuthService.revokeAccessToken(oldAccessToken.id);
        await OAuthService.revokeRefreshToken(refresh_token);

        const newAccessToken = await TokenService.createAccessToken(oldAccessToken.user_id!, client_id, oldAccessToken.scopes);
        const newRefreshToken = await TokenService.createRefreshToken(newAccessToken.id);

        res.json({
            access_token: TokenService.generateJWT(newAccessToken),
            token_type: 'Bearer',
            expires_in: Math.floor((newAccessToken.expires_at.getTime() - Date.now()) / 1000),
            refresh_token: newRefreshToken.id,
            scope: newAccessToken.scopes?.join(' '),
        });
    }

    static async register(req: Request, res: Response) {
        try {
            const validation = validateRegister(req.body);

            if (!validation.success) {
                res.status(400).json({
                    errors: validation.error.errors
                });
                return;
            }

            // Validate client credentials
            if (!await OAuthController.handleValidateClient(req.body, res)) return;

            const {email, password, firstName, lastName}: RegisterInput = validation.data;

            const result = await UserService.create({ email, password, firstName, lastName });

            if (result.affectedRows === 1) {
                res.status(201).json({
                    message: 'User registered successfully!',
                    userId: result.insertId,
                });
            } else {
                res.status(500).json({
                    message: 'Failed to register user.',
                });
            }

        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(400).json({message: 'Email already exists'});
                return;
            }
            console.error(error);
            res.status(500).json({message: 'Server error'});
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            if (!req.accessToken) {
                res.status(400).json({message: 'Access token not found'});
                return;
            }

            const linkedRefreshToken = await TokenService.getRefreshTokenByAccessToken(req.accessToken);
            if (!linkedRefreshToken) {
                res.status(400).json({message: 'Invalid access token'});
                return;
            }

            // Revoke access and refresh token
            await OAuthService.revokeAccessToken(req.accessToken);
            await OAuthService.revokeRefreshToken(linkedRefreshToken.id);

            res.status(201).json({message: 'Logout successfully'});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Server error'});
        }
    }
}