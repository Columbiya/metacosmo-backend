import emailService from "../emails/emailService.js";
import newService from "./newService.js";

class NewController {

    async getAll(req, res, next) {  
        let { page, limit } = req.query
        console.log(req.query)
        page = page || 1
        limit = limit || 8
        console.log(limit)
        const news = await newService.getAll(page, limit)
        return res.json(news)
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const news = await newService.getOne(id)
            return res.json(news)
        } catch(e) {
            next(e) 
        }
    }

    async create(req, res, next) {
        try {
            const { subtitle, title, author, boldText, text, twoColumnContentFirst, twoColumnContentSecond, oneColumnContent, hider, quote } = req.body
            const { img } = req.files
            const createdNew = await newService.create({title, subtitle, author, img, boldText, text, twoColumnContentFirst, twoColumnContentSecond, oneColumnContent, quote, hider})
            await emailService.broadcast(createdNew, true)
            return res.json(createdNew)
        } catch(e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.body
            const deleted = await newService.delete(id)
            res.json(deleted)
        } catch(e) {
            next(e)
        }
    }
}

export default new NewController()