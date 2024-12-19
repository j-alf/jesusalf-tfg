import {Router} from 'express';
import {OauthMiddleware} from '../middleware/oauth.middleware';
import {
    createRefund,
    deleteRefund,
    getRefundDetails,
    getRefunds,
    updateRefund
} from '../controllers/refund.controller';
import {MemberMiddleware} from '../middleware/member.middleware';

const router = Router();

router.use(OauthMiddleware);

router.route('/')
    .get(MemberMiddleware, getRefunds)
    .post(MemberMiddleware, createRefund);

router.route('/:refundId')
    .get(MemberMiddleware, getRefundDetails)
    .put(MemberMiddleware, updateRefund)
    .delete(MemberMiddleware, deleteRefund);

export default router;