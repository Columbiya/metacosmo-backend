import collectionsService from "./collectionsService.js"

class CollectionsController {

    async getAll(req, res, next) {
        const { limit = 4, page = 1 } = req.query
        const collections = await collectionsService.getAll(page, limit)
        res.json(collections)
    }

    async create(req, res, next) {
        try {
            const { name, description, order, link } = req.body
            const { img } = req.files

            const createdCollection = await collectionsService.create(name, order, description, img, link)
            res.json(createdCollection)
        } catch(e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.body
            const deletedCollection = await collectionsService.delete(id)
            res.json(deletedCollection)
        } catch(e) {
            next(e)
        }
    }

    async changeOrder(req, res, next) {
        try {
            const { id, order } = req.body
            const changedCollection = await collectionsService.changeOrder(id, order)
            res.json(changedCollection)
        } catch(e) {
            next(e)
        }
 
    }
}

export default new CollectionsController()