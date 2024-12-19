import {Request, Response} from 'express';
import {ExpenseService} from '../services/expense.service';
import {MemberService} from '../services/member.service';
import {BalanceUtils} from '../utils/balance.utils';
import {
    validateCreateExpenseData, validateDeleteExpenseData,
    validateDetailsExpenseData,
    validateUpdateExpenseData
} from '../schemas/expense.schema';

export const getExpenses = async (req: Request, res: Response) => {
    try {
        const expenses = await ExpenseService.getExpenses(req.groupId);
        res.json(expenses);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const getExpenseDetails = async (req: Request, res: Response) => {
    try {
        const validation = validateDetailsExpenseData({headers: req.headers, params: req.params});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const expense = await ExpenseService.getExpenseById(parseInt(validation.data.params.expenseId));
        if (!expense) {
            res.status(404).json({message: 'Expense not found'});
            return;
        }

        res.json(expense);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const createExpense = async (req: Request, res: Response) => {
    try {
        const validation = validateCreateExpenseData({headers: req.headers, body: req.body});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        if (!BalanceUtils.validateTotalSplits(validation.data.body.amount, validation.data.body.splits)) {
            res.status(400).json({message: 'Split amounts must equal total amount'});
            return;
        }

        if (!await BalanceUtils.validateMembersSplits(req.groupId, validation.data.body.paidBy, validation.data.body.splits)) {
            res.status(400).json({message: 'All split members and the payer must belong to the group'});
            return;
        }

        const expenseId = await ExpenseService.createExpense(
            {
                groupId: req.groupId,
                name: validation.data.body.name,
                amount: validation.data.body.amount,
                type: validation.data.body.type,
                description: validation.data.body.description,
                paidBy: validation.data.body.paidBy,
                splits: validation.data.body.splits
            }
        );

        const expenseDetails = await ExpenseService.getExpenseById(expenseId);
        res.status(201).json(expenseDetails);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const updateExpense = async (req: Request, res: Response) => {
    try {
        const validation = validateUpdateExpenseData({headers: req.headers, params: req.params, body: req.body});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        if (!BalanceUtils.validateTotalSplits(validation.data.body.amount, validation.data.body.splits)) {
            res.status(400).json({message: 'Split amounts must equal total amount'});
            return;
        }

        if (!await BalanceUtils.validateMembersSplits(req.groupId, validation.data.body.paidBy, validation.data.body.splits)) {
            res.status(400).json({message: 'All split members and the payer must belong to the group'});
            return;
        }

        await ExpenseService.updateExpense(
            {
                id: parseInt(validation.data.params.expenseId),
                groupId: req.groupId,
                name: validation.data.body.name,
                amount: validation.data.body.amount,
                type: validation.data.body.type,
                description: validation.data.body.description,
                paidBy: validation.data.body.paidBy,
                splits: validation.data.body.splits
            }
        );

        res.json({message: 'Expense updated successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const deleteExpense = async (req: Request, res: Response) => {
    try {
        const validation = validateDeleteExpenseData({headers: req.headers, params: req.params});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const expense = await ExpenseService.getExpenseById(parseInt(validation.data.params.expenseId));
        if (!expense) {
            res.status(404).json({message: 'Expense not found'});
            return;
        }

        // Hacer pruebas (ahora se podría eliminar)
        const membershipId = await MemberService.getMemberIdByUserId(expense.groupId, req.userId);
        if (!membershipId) {
            res.status(403).json({message: 'Not authorized'});
            return;
        }

        await ExpenseService.deleteExpense(parseInt(validation.data.params.expenseId), expense.groupId);
        res.json({message: 'Expense deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};