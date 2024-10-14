import { Request } from 'express';

export const getToken = (req: Request): string | null => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    return token && token.length ? token : null;
};
