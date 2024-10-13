import bcrypt from "bcrypt-ts"

export const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, 10)
}

export const verifyPassword = (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
}