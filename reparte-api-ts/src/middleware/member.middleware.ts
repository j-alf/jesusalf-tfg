import {NextFunction, Request, Response} from 'express';
import {MemberService} from "../services/member.service";
import {validateGroupIdParams} from "../schemas/group.schema";

export const MemberMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const groupIdSource = req.params.groupId ?? req.header('X-Group-ID');

        const validateGroupRequest = validateGroupIdParams({ groupId: groupIdSource});
        if (!validateGroupRequest.success) {
            res.status(400).json({errors: validateGroupRequest.error.errors});
            return;
        }

        const memberId = await MemberService.getMemberIdByUserId(parseInt(validateGroupRequest.data.groupId), req.userId);
        if (!memberId) {
            res.status(403).json({message: 'Not authorized'});
            return;
        }

        req.memberId = memberId;
        req.groupId = parseInt(validateGroupRequest.data.groupId);
        next();
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};