import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../error/error";
import { config } from "../../config/config";
import jwt, {JwtPayload} from 'jsonwebtoken';

interface AuthenticatedRequest extends Request{
    user? : JwtPayload | string;
}

const JWTMiddleware = async (req : AuthenticatedRequest, res : Response, next : NextFunction) => {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;
    if (!token) {
        return errorHandler(res, 'Authorization header missing', 401);
    }
    try{
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return errorHandler(res, 'Invalid or expired token', 401);
    }
}

export {JWTMiddleware};