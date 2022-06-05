import instructionsService from "./instructionsService.js"

class InstructionsController {

    async getAll(req, res, next) {
        const { limit = 4, page = 1 } = req.query
        const collections = await instructionsService.getAll(page, limit)
        res.json(collections)
    }

    async create(req, res, next) {
        try {
            const { name, description, link } = req.body
            const { img } = req.files

            const createdCollection = await instructionsService.create(name, description, img, link)
            res.json(createdCollection)
        } catch(e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.body
            const deletedCollection = await instructionsService.delete(id)
            res.json(deletedCollection)
        } catch(e) {
            next(e)
        }
    }
}

export default new InstructionsController()