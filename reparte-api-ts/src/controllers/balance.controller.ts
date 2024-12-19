import {Request, Response} from 'express';
import {BalanceUtils} from "../utils/balance.utils";
import {validateBalanceData} from "../schemas/balance.schema";

export const getBalance = async (req: Request, res: Response) => {
    try {
        const validation = validateBalanceData({headers: req.headers});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const {
            memberBalances,
            settlements
        } = await BalanceUtils.calculateBalances(req.groupId);

        res.json({
            memberBalances,
            settlements
        });
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};