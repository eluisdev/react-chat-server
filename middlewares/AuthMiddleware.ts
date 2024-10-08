import { Request, Response, NextFunction } from "express"
import jwt , {JwtPayload}from "jsonwebtoken"
import { IUser } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            userId?: IUser['id']
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction)  => {
    const token = req.cookies.jwt;
    if (!token) {
        res.status(401).send("You are not authenticated!")
        return
    }
    jwt.verify(token, process.env.JWT_KEY, async (err: Error, payload: JwtPayload) => {
        if (err) res.status(403).send("Token is not valid!")
        req.userId = payload.userId
        next()
        
    })
}

