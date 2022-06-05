import partnersService from "./partnersService.js"

class PartnersController {

    async getAll(req, res, next) {
        const partners = await partnersService.getAll()
        return res.json(partners)
    }

    async create(req, res, next) {
        try {
            const { link } = req.body
            const { img } = req.files
            const createdPartner = await partnersService.create(img, link)
            return res.json(createdPartner)
        } catch(e) {
           next(e) 
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.body
            const deletedPartner = await partnersService.delete(id)
            return res.json(deletedPartner)
        } catch(e) {
            next(e)
        }
    }

}

export default new PartnersController()