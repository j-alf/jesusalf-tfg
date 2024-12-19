import {Router} from 'express';
import {OAuthController} from '../controllers/oauth.controller';
import {OauthMiddleware} from "../middleware/oauth.middleware";

const router = Router();

router.post('/register', OAuthController.register);
router.post('/token', OAuthController.token);
router.post('/logout', OauthMiddleware, OAuthController.logout);
router.post('/logout', OauthMiddleware, OAuthController.logout);

export default router;