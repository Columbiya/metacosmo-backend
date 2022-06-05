import models from "../models/models.js"
import ApiError from './../error/ApiError.js';

class TokenService {

    async getAll() {
        const tokens = await models.Token.findAll()
        return tokens
    }

    async getWeekTokens(name, chain) {
        if (!name || !chain) {
            throw ApiError.badRequest('Не указаны параметры для недельных токенов')
        }

        const tokens = await models.Token.findAll({where: {name, chain}, order: [['createdAt', 'ASC']]})
        return tokens
    }

    async getDailyWithPrev(name, chain) {
        if (!name || !chain) {
            throw ApiError.badRequest('Не указаны параметры для токена')
        }

        const tokens = await models.Token.findAll({where: {name, chain}, order: [['createdAt', 'DESC']]})
        return {
            current: tokens[0], prev: tokens[1]
        }
    }

    async createToken(name, chain, liquidity, price) {
        if (!name || !chain || !liquidity || !price) {
            throw ApiError.badRequest('Не указаны необходимые данные для создания токена')
        }

        const candidates = await models.Token.findAll({where: {name, chain}, order: [['createdAt', 'ASC']]})
        let token

        if (candidates.length) {
            let date = new Date(candidates[0].createdAt)
            let now = Date.now()

            if (now - date >= 86400000 && candidates.length < 7) {
                token = await models.Token.create({name, chain, liquidity, price})
            }
            else if (now - date < 86400000) {
                throw ApiError.forbidden('Еще не прошел день с создания токена')
            }
            else {
                await candidates[0].destroy()
                token = await models.Token.create({name, chain, liquidity, price})
            }
        }
        else {
            token = await models.Token.create({name, chain, liquidity, price})
        }

        return token
    }

}

export default new TokenService()