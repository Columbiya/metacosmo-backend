import request from "request"
import tokenService from "./tokenService.js"

class TokenController {

    async getAll(req, res, next) {
        try {
            const token = await tokenService.getAll()
            return res.json(token)
        } catch(e){
            next(e)
        }
    }

    async getWeekTokens(req, res, next) {
        try {
            const { name, chain } = req.body
            const tokens = await tokenService.getWeekTokens(name, chain)
            return res.json(tokens)
        } catch(e) {
            next(e)
        }
    }

    async getDailyWithPrev(req, res, next) {
        try {
            const { name, chain } = req.body
            const tokens = await tokenService.getDailyWithPrev(name, chain)
            return res.json(tokens)
        } catch(e) {
            next(e)
        }
    }

    async fetchTokens(req, response, next) {
        try {
            request('https://cosmoswap.space/exchange', (err, res, body) => {
                if (err) throw err

                response.json(body)
            })
        } catch(e) {
            next(e)
        }
    }

    async createToken(req, res, next) {
        try {
            const { name, chain, liquidity, price } = req.body
            const token = await tokenService.createToken(name, chain, liquidity, price)
            return res.json(token)
        } catch(e) {
            next(e)
        }
    }

}

export default new TokenController()