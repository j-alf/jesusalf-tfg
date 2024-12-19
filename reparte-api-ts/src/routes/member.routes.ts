import {Router} from 'express';
import {OauthMiddleware} from '../middleware/oauth.middleware';
import {
    getMembers,
    addMember,
    updateMember,
    deleteMember,
    associateUserMember
} from '../controllers/member.controller';
import {MemberMiddleware} from "../middleware/member.middleware";

const router = Router();

router.use(OauthMiddleware);

router.route('/')
    .get(MemberMiddleware, getMembers)
    .post(MemberMiddleware, addMember);

router.route('/:memberId')
    .put(MemberMiddleware, updateMember)
    .delete(MemberMiddleware, deleteMember);

router.post('/associate', associateUserMember);

export default router;