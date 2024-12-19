import {Request, Response} from 'express';
import {MemberService} from "../services/member.service";
import {GroupService} from "../services/group.service";
import {
    validateAddMemberData,
    validateAssociateUserMemberData,
    validateDeleteMemberData,
    validateGetMembersData,
    validateUpdateMemberData
} from "../schemas/member.schema";

export const getMembers = async (req: Request, res: Response) => {
    try {
        const validation = validateGetMembersData({headers: req.headers});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const members = await MemberService.getMembers(req.groupId);
        res.json(members);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const addMember = async (req: Request, res: Response) => {
    try {
        const validation = validateAddMemberData({headers: req.headers, body: req.body});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        await MemberService.addMember(req.groupId, validation.data.body.memberName, req.userId);
        const group = await GroupService.findGroupById(req.groupId);

        res.status(201).json({
            message: 'New member added successfully',
            inviteUrl: `${process.env.APP_URL}/groups/join/${group?.invite_code}`
        });
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const updateMember = async (req: Request, res: Response) => {
    try {
        const validation = validateUpdateMemberData({headers: req.headers, params: req.params, body: req.body});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const member = await MemberService.getMemberById(parseInt(validation.data.params.memberId));
        if (!member) {
            res.status(404).json({message: 'Member not found'});
            return;
        }

        const isCreator = await MemberService.isGroupCreator(req.groupId, req.memberId);
        if (!isCreator && req.memberId !== parseInt(validation.data.params.memberId)) {
            res.status(403).json({message: 'Not authorized to update this member'});
            return;
        }

        await MemberService.updateMember(req.groupId, parseInt(validation.data.params.memberId), {memberName: validation.data.body.memberName});
        res.json({message: 'Member updated successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};
export const deleteMember = async (req: Request, res: Response) => {
    try {
        const validation = validateDeleteMemberData({headers: req.headers, params: req.params});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const member = await MemberService.getMemberById(parseInt(validation.data.params.memberId));
        if (!member) {
            res.status(404).json({message: 'Member not found'});
            return;
        }

        const isCreator = await MemberService.isGroupCreator(req.groupId, req.memberId);
        if (!isCreator && req.memberId !== parseInt(validation.data.params.memberId)) {
            res.status(403).json({message: 'Not authorized to remove this member'});
            return;
        }

        await MemberService.deleteMember(req.groupId, parseInt(validation.data.params.memberId));
        res.json({message: 'Member removed successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const associateUserMember = async (req: Request, res: Response) => {
    try {
        const validation = validateAssociateUserMemberData({body: req.body});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const member = await MemberService.getMemberById(validation.data.body.memberId);
        if (!member || member.user_id !== null) {
            res.status(404).json({message: 'Invalid or already associated membership'});
            return;
        }

        await MemberService.associateUserMembership(validation.data.body.memberId, req.userId);
        res.json({message: 'Successfully associated member'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};
