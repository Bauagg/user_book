import jwt, { JwtPayload } from "jsonwebtoken";

const secret = 'hfuopoiefxpoi'

export interface TokenPayload {
    userId: any;
    role: string;
    email: string
}

export const createToken = (token: TokenPayload): string => {
    return jwt.sign(token, secret)
}

export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, secret) as JwtPayload; // Type assertion to JwtPayload
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token has expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid Token');
        } else {
            throw new Error('An unknown error occurred during token verification');
        }
    }
};