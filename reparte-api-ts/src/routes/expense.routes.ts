import {Router} from 'express';
import {OauthMiddleware} from '../middleware/oauth.middleware';
import {
    createExpense,
    deleteExpense,
    getExpenseDetails,
    getExpenses,
    updateExpense
} from '../controllers/expense.controller';
import {MemberMiddleware} from "../middleware/member.middleware";

const router = Router();

router.use(OauthMiddleware);

router.route('/')
    .get(MemberMiddleware, getExpenses)
    .post(MemberMiddleware, createExpense);

router.route('/:expenseId')
    .get(MemberMiddleware, getExpenseDetails)
    .put(MemberMiddleware, updateExpense)
    .delete(MemberMiddleware, deleteExpense);

export default router;