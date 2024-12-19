import {Request, Response} from 'express';
import {RefundService} from '../services/refund.service';
import {MemberService} from '../services/member.service';
import {BalanceUtils} from '../utils/balance.utils';
import {
    validateCreateRefundData, validateDeleteRefundData,
    validateDetailsRefundData,
    validateUpdateRefundData
} from '../schemas/refund.schema';

export const getRefunds = async (req: Request, res: Response) => {
    try {
        const refunds = await RefundService.getRefunds(req.groupId);
        res.json(refunds);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const getRefundDetails = async (req: Request, res: Response) => {
    try {
        const validation = validateDetailsRefundData({headers: req.headers, params: req.params});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const refund = await RefundService.getRefundById(parseInt(validation.data.params.refundId));
        if (!refund) {
            res.status(404).json({message: 'Refund not found'});
            return;
        }

        res.json(refund);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const createRefund = async (req: Request, res: Response) => {
    try {
        const validation = validateCreateRefundData({headers: req.headers, body: req.body});
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

        const refundId = await RefundService.createRefund(
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

        const refundDetails = await RefundService.getRefundById(refundId);
        res.status(201).json(refundDetails);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const updateRefund = async (req: Request, res: Response) => {
    try {
        const validation = validateUpdateRefundData({headers: req.headers, params: req.params, body: req.body});
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

        await RefundService.updateRefund(
            {
                id: parseInt(validation.data.params.refundId),
                groupId: req.groupId,
                name: validation.data.body.name,
                amount: validation.data.body.amount,
                type: validation.data.body.type,
                description: validation.data.body.description,
                paidBy: validation.data.body.paidBy,
                splits: validation.data.body.splits
            }
        );

        res.json({message: 'Refund updated successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const deleteRefund = async (req: Request, res: Response) => {
    try {
        const validation = validateDeleteRefundData({headers: req.headers, params: req.params});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const refund = await RefundService.getRefundById(parseInt(validation.data.params.refundId));
        if (!refund) {
            res.status(404).json({message: 'Refund not found'});
            return;
        }

        // Hacer pruebas (se podría eliminar)
        const membershipId = await MemberService.getMemberIdByUserId(refund.groupId, req.userId);
        if (!membershipId) {
            res.status(403).json({message: 'Not authorized'});
            return;
        }

        await RefundService.deleteRefund(parseInt(validation.data.params.refundId), refund.groupId);
        res.json({message: 'Refund deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};