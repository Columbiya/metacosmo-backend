import AuthService from "./AuthService.js"
import ApiError from './../error/ApiError.js';

class AuthController {
    async login(req, res, next) {
        try {
            const { username, password } = req.body
            const token = await AuthService.login(username, password)
            res.json({token})
        } catch(e) {
            next(e)
        }
    }

    async check(req, res, next) {
        try {
            const authorization = req.headers.authorization
            if (!authorization) {
                throw ApiError.badRequest('нету авторизации')
            }

            const token = authorization.split(' ')[1]
            await AuthService.check(token)
            return res.json({message: "есть доступ"})
        } catch(e) {
            next(e)
        }
    }
}

export default new AuthController()