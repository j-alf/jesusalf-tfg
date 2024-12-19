import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {OAuthService} from "../services/oauth.service";

declare global {
    namespace Express {
        interface Request {
            userId: number;
            accessToken: string;
            memberId: number;
            groupId: number;
        }
    }
}
export const OauthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(403).json({message: 'Authentication required'});
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, accessToken: string };
        req.userId = decoded.userId;
        req.accessToken = decoded.accessToken;


        const existingAccessToken = await OAuthService.verifyAccessToken(decoded.accessToken);
        if (!existingAccessToken) {
            res.status(401).json({message: 'Invalid or expired token'});
            return;
        }

        next();
    } catch (error) {
        res.status(401).json({message: 'Invalid or expired token'});
    }
};