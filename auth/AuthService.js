import ApiError from './../error/ApiError.js'
import { username as userName, password as passWord } from './../consts.js';
import jwt from 'jsonwebtoken'

function makeToken(login) {
    return jwt.sign(
        {username: login}, 
        process.env.SECRET_KEY, 
        {expiresIn: '24h'}
    )
}

class AuthService {
    async login(username, password) {
        if (!username || !password) {
            throw ApiError.badRequest('Не передан пароль или логин')
        }

        if (username !== userName) {
            throw ApiError.forbidden('Неправильный логин или пароль')
        }
        else if (password !== passWord) {
            throw ApiError.forbidden('Неправильный логин или пароль')
        }

        const token = makeToken(username)
        return token
    }

    async check(token) {
        if(!token) {
            throw ApiError.badRequest('нету токена') 
        }
        
        jwt.verify(token, process.env.SECRET_KEY)
    }
}

export default new AuthService()