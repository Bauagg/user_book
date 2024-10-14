import { Request, Response, NextFunction } from 'express';
import { getToken } from '../utils/get-token';
import * as jwt from "../utils/jwt";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = getToken(req);
        if (!token) {
            res.status(401).json({ error: true, message: 'Authentication failed' });
            return
        }

        const verifyToken = jwt.verifyToken(token);
        if (!verifyToken) {
            res.status(401).json({ error: true, message: 'Authentication failed' });
            return
        }

        req.user = verifyToken as jwt.TokenPayload; // Attach the user information to the request object
        next();
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;
