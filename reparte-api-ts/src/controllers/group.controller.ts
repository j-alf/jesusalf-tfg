import {Request, Response} from 'express';
import {GroupService} from "../services/group.service";
import {UserService} from "../services/user.service";
import {MemberService} from "../services/member.service";
import {sendInviteEmail} from "../utils/email.utils";
import {
    validateCreateGroupData,
    validateDeleteGroupData,
    validateDetailsGroupData,
    validateInviteEmailGroupData,
    validateInviteGroupData,
    validateUpdateGroupData
} from "../schemas/group.schema";

export const getUserGroups = async (req: Request, res: Response) => {
    try {
        const groups = await GroupService.findGroupByUserId(req.userId);
        res.json(groups);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const getGroupDetails = async (req: Request, res: Response) => {
    try {
        const validation = validateDetailsGroupData({params: req.params});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const group = await GroupService.findGroupById(req.groupId);
        if (!group) {
            res.status(404).json({message: 'Group not found'});
            return;
        }

        res.json(group);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};
export const createGroup = async (req: Request, res: Response) => {
    try {
        const validation = validateCreateGroupData({body: req.body});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const user = await UserService.findById(req.userId);
        const fullName = (user?.firstName ?? '') + ' ' + (user?.lastName ?? '');

        const groupId = await GroupService.createGroup({
            name: validation.data.body.name,
            creator_user: req.userId
        }, fullName);
        const group = await GroupService.findGroupById(groupId);

        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const updateGroup = async (req: Request, res: Response) => {
    try {
        const validation = validateUpdateGroupData({params: req.params, body: req.body});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const isCreator = await MemberService.isGroupCreator(req.groupId, req.memberId);
        if (!isCreator) {
            res.status(403).json({message: 'Only group creator can update the group'});
            return;
        }

        await GroupService.updateGroup(req.groupId, {name: validation.data.body.name});
        const updatedGroup = await GroupService.findGroupById(req.groupId);

        res.json(updatedGroup);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const deleteGroup = async (req: Request, res: Response) => {
    try {
        const validation = validateDeleteGroupData({params: req.params,});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }
        const isCreator = await MemberService.isGroupCreator(req.groupId, req.memberId);
        if (!isCreator) {
            res.status(403).json({message: 'Only group creator can delete the group'});
            return;
        }

        await GroupService.deleteGroup(req.groupId);
        res.json({message: 'Group deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const getGroupByInviteCode = async (req: Request, res: Response) => {
    try {
        const validation = validateInviteGroupData({params: req.params});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const group = await GroupService.findGroupByInviteCode(validation.data.params.inviteCode);
        if (!group) {
            res.status(404).json({message: 'Group not found'});
            return;
        }

        const membershipId = await MemberService.getMemberIdByUserId(group.id!, req.userId);
        if (membershipId) {
            res.status(400).json({message: 'You are already a member of this group'});
            return;
        }

        const members = await MemberService.getMembers(group.id!);
        res.json({
            group: {
                id: group.id,
                name: group.name
            },
            members
        });
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const inviteToGroup = async (req: Request, res: Response) => {
    try {
        const validation = validateInviteEmailGroupData({params: req.params, body: req.body});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const group = await GroupService.findGroupById(req.groupId);
        if (!group) {
            res.status(404).json({message: 'Group not found'});
            return;
        }

        sendInviteEmail(validation.data.body.email, group.invite_code).catch(err => console.error('Failed to send email:', err));
        res.json({message: 'Invitation is being sent in the background'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};
