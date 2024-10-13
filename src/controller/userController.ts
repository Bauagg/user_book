import { Request, Response, NextFunction } from "express";
import User from "../model/user";
import { hashPassword, verifyPassword } from "../utils/bcrypt";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, role } = req.body

        const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!regexEmail.test(email)) return res.status(400).json({ message: "Invalid email or password" })

        // Cek jika email sudah ada
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const createUser = await User.create({ name, email, password: await hashPassword(password), role })

        res.status(201).json({ message: 'register successful', data: createUser })
    } catch (error) {
        console.log(error)
        next(error)
    }
}