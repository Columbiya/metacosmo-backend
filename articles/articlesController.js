import emailService from "../emails/emailService.js"
import articlesService from "./articlesService.js"

class ArticlesController {

    async getAll(req, res, next) {
        let { page, limit } = req.query
        page = page || 1
        limit = limit || 16
        const articles = await articlesService.getAll(page, limit)
        return res.json(articles)
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const news = await articlesService.getOne(id)
            return res.json(news)
        } catch(e) {
            next(e)
        }
    }

    async create(req, res, next) {
        try {
            const { title, author, quote, boldText, text, twoColumnContentFirst, twoColumnContentSecond, oneColumnContent, address, hider } = req.body
            const article = await articlesService.create({title, author, quote, boldText, text, twoColumnContentFirst, twoColumnContentSecond, oneColumnContent, address, hider})
            await emailService.broadcast(article)
            return res.json(article)
        } catch(e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.body
            console.log(id)
            const deleted = await articlesService.delete(id)
            res.json(deleted)
        } catch(e) {
            next(e)
        }
    }

}

export default new ArticlesController()