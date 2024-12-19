import {Request, Response} from 'express';
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import bcrypt from "bcryptjs";
import {validateUpdateUserData, validateUpdateUserPasswordData} from "../schemas/user.schema";

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await UserService.findById(req.userId);
        res.json(user as User || null);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const validation = validateUpdateUserData({body: req.body});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const existingUser = await UserService.findByEmail(validation.data.body.email);
        if (existingUser && existingUser.id !== req.userId) {
            res.status(400).json({message: 'Email already in use'});
            return;
        }

        await UserService.updateUser(req.userId, {
            firstName: validation.data.body.firstName,
            lastName: validation.data.body.lastName,
            email: validation.data.body.email,
        });

        const updatedUser = await UserService.findById(req.userId);
        if (!updatedUser) {
            res.status(404).json({message: 'User not found'});
            return;
        }

        const {password, ...userWithoutPassword} = updatedUser;
        res.json({user: userWithoutPassword});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const validation = validateUpdateUserPasswordData({body: req.body});
        if (!validation.success) {
            res.status(400).json({errors: validation.error.errors});
            return;
        }

        const user = await UserService.findById(req.userId);
        if (!user) {
            res.status(404).json({message: 'User not found'});
            return;
        }

        const isValidPassword = await bcrypt.compare(validation.data.body.currentPassword, user.password);
        if (!isValidPassword) {
            res.status(401).json({message: 'Current password is incorrect'});
            return;
        }

        const hashedPassword = await bcrypt.hash(validation.data.body.newPassword, 10);
        await UserService.updatePassword(req.userId, hashedPassword);

        res.json({message: 'Password updated successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};