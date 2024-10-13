import { Request, Response, NextFunction } from 'express';

// Define the custom error interface
export interface CustomError extends Error {
    code?: number;
    errors?: any;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.log(err);

    const validateError = {
        error: true,
        method: req.method,
        url: req.url
    };

    // Handle JWT authentication error
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ ...validateError, message: 'Authentication failed' });
    }

    // Handle custom errors with a code and message
    if (err.code && err.message) {
        return res.status(err.code).json({ ...validateError, message: err.message });
    }

    // Default internal server error
    res.status(500).json({ ...validateError, message: 'Internal server error', error: err.errors });
};
