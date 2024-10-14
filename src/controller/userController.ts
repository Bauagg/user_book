import { Request, Response, NextFunction } from "express";
import User from "../model/user";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { createToken, TokenPayload } from "../utils/jwt";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regexEmail.test(email)) {
            res.status(400).json({ message: "Invalid email or password" });
            return
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Email already registered' });
            return
        }

        const hashedPassword = await hashPassword(password);
        const createUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({ message: 'Register successful', data: createUser });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body

        const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regexEmail.test(email)) {
            res.status(400).json({ message: "Invalid email or password" });
            return
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            res.status(400).json({ message: 'Your email or password is incorrect' });
            return
        }

        const validatePassword = await verifyPassword(password, existingUser.password)
        if (!validatePassword) {
            res.status(400).json({ message: 'Your email or password is incorrect' });
            return
        }

        // Prepare token payload
        const tokenPayload: TokenPayload = {
            userId: existingUser._id, // Ensure userId is a string
            role: existingUser.role,
            email: existingUser.email
        };

        const token = await createToken(tokenPayload)

        res.status(200).json({
            message: 'Message successful',
            data: {
                _id: existingUser._id,
                role: existingUser.role,
                email: existingUser.email,
                token
            }
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const profileUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.userId; // Assuming userId is set in the TokenPayload

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return
        }

        // Find the user in the database
        const user = await User.findById(userId).select('-password'); // Exclude password field

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        // Return user profile data
        res.status(200).json({ message: "Profile user successful", data: user });
    } catch (error) {
        console.log(error);
        next(error);
    }
}