import { Response } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
    res: Response,
    err: Error | ZodError | unknown,
    statusCode?: number
) => {
    let message: string;

    if (typeof err === 'string') {
        message = err;
    } else {
        message = 'An unexpected error occurred.';
    }
    statusCode = statusCode || 500;
    if (err instanceof Error) {
        message = err.message || message;
    }

    // Zod errors
    else if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        const formattedErrors = err.errors.map(error => ({
            path: error.path.join('.'),
            message: error.message
        }));
        return res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
            errors: formattedErrors
        });
    }

    else {
        console.error('Internal Server Error:', err);
    }

    return res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};