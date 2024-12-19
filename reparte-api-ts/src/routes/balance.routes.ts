import {Router} from 'express';
import {OauthMiddleware} from '../middleware/oauth.middleware';
import {getBalance} from "../controllers/balance.controller";
import {MemberMiddleware} from "../middleware/member.middleware";

const router = Router();

router.use(OauthMiddleware);

router.get('/', MemberMiddleware, getBalance);

export default router;