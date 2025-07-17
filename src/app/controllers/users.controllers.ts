
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { UserModel } from '../models/users.models';
import * as z from "zod";
const bcrypt = require('bcrypt');

export const userRouter = express.Router();

// Define a Zod schema for user validation
const User = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").max(100, "Name must be between 2 and 100 characters"),
  email: z.string().email(),
  age: z.number().min(18, "Age must be at least 18"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(['user', 'admin']).optional(),
});

// Get all users
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModel.find();
        res.status(200).send({
            message: 'Users retrieved successfully',
            users
        });
    } catch (error) {
        next(error);
    }
});

// Fetch a user by ID
userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findOne({ id: id });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({
            message: 'User found successfully',
            user
        });
    } catch (error) {
        next(error);
    }
});

// Create a new user
userRouter.post('/create-user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const body = req.body;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const body = {
            ...req.body,
            password: hashedPassword // Store the hashed password
        };
        const zBody = User.parse(body); // Validate and parse the request body
        const user = await UserModel.create(zBody);
        console.log(zBody);
        res.status(201).send({
            message: 'User created successfully',
            user: user
        });
    } catch (error) {
        next(error);
    }
});

//  update a user by ID
userRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const user = await UserModel.updateOne({ id: id }, updateData, { new: true });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({
            message: 'User updated successfully',
            updateData
        });
    } catch (error) {
        next(error);
    }
});


// Delete a user by ID
userRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await UserModel.deleteOne({ id: id });
        if (user.deletedCount === 0) {      
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({
            message: 'User deleted successfully',
            user
        }); 
    } catch (error) {
        next(error);
    }
});