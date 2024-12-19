import {Router} from 'express';
import {OauthMiddleware} from '../middleware/oauth.middleware';
import {getUser, updatePassword, updateUser} from "../controllers/user.controller";

const router = Router();

router.use(OauthMiddleware);

router.route('/me')
    .get(getUser)
    .put(updateUser);

router.route('/me/password')
    .put(updatePassword);

export default router;