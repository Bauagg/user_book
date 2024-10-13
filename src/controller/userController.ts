import { Request, Response, NextFunction } from "express";
import User from "../model/user";
import { hashPassword } from "../utils/bcrypt"; // Ensure this utility is correctly defined

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
