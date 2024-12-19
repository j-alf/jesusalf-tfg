import {Router} from 'express';
import {OauthMiddleware} from '../middleware/oauth.middleware';
import {
    createGroup,
    deleteGroup,
    getGroupByInviteCode,
    getGroupDetails,
    getUserGroups,
    inviteToGroup,
    updateGroup,
} from '../controllers/group.controller';
import {MemberMiddleware} from "../middleware/member.middleware";


const router = Router();

router.use(OauthMiddleware);

router.route('/')
    .get(getUserGroups)
    .post(createGroup);

router.route('/:groupId')
    .get(MemberMiddleware, getGroupDetails)
    .put(MemberMiddleware, updateGroup)
    .delete(MemberMiddleware, deleteGroup);

// Group invitation routes
router.get('/join/:inviteCode', getGroupByInviteCode);
router.post('/:groupId/invite', MemberMiddleware, inviteToGroup);

export default router;