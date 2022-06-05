import ApiError from "../error/ApiError.js";
import jwt from 'jsonwebtoken';

export default function(req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const authorization = req.headers.authorization
        if (!authorization) {
            return next(ApiError.forbidden('доступ запрещен'))
        }
        const token = authorization.split(' ')[1]
    
        jwt.verify(token, process.env.SECRET_KEY)
        next()
    } catch(e) {
        next(e)
    }
}