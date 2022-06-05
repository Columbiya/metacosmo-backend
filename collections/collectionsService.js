import models from "../models/models.js"
import ApiError from './../error/ApiError.js';
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { readdir } from "fs/promises";
import * as fs from 'fs'

class CollectionsService {

    async getAll(page, limit) {
        const offset = page * limit - limit
        const collections = await models.Collection.findAndCountAll({offset, limit: +limit, order: [['order', 'ASC']]})
        return collections
    }

    async create(name, order, description, img, link) {
        if (!name || !order || !description || !img || !link) {
            throw ApiError.badRequest('Не указаны нужные параметры для создания коллекции')
        }

        const collections = await models.Collection.findAll({order: [['order', 'ASC']]})
        order = order > collections.length ? collections.length + 1: order

        const candidate = await models.Collection.findOne({where: {name}})

        if (candidate) {
            throw ApiError.badRequest('Коллекция с указанным именем уже существует')
        }

        const __dirname = path.resolve()
        const fileName = uuidv4() + '.jpg'
        img.mv(path.resolve(__dirname, 'static', 'collections', fileName))

        const createdCollection = await models.Collection.create({ name, order, description, img: fileName, link })
        if (order !== collections.length + 1) {
            await this.changeOrder(createdCollection.id, order)
        }
        return createdCollection
    }

    async delete(id) {
        if (!id) {
            throw ApiError.badRequest('Не указан id коллекции, которую хотите удалить')
        }

        const candidate = await models.Collection.findByPk(id)
        if (!candidate) {
            throw ApiError.badRequest('Коллекции с указанным id не существует')
        }

        const __dirname = path.resolve()
        const files = await readdir(path.resolve(__dirname, 'static', 'collections'))
        
        for (let file of files) {
            if (file === candidate.img) {
                fs.unlink(path.resolve(__dirname, 'static', 'collections', file), (err) => {
                    if (err) {
                        throw ApiError.badRequest('Такого файла не существует')
                    }
                })

                break;
            }
        }

        candidate.destroy()
        return candidate
    }

    async changeOrder(id, order) {
        if (!id || !order) {
            throw ApiError.badRequest('Не указаны необходимые параметры для смены порядка коллекции')
        }

        const collections = await models.Collection.findAll({order: [['order', 'ASC']]})
        order = order > collections.length ? collections.length: order

        const collectionToChange = collections.find(item => item.id === id)
        const indexToChange = collections.findIndex(item => item.id === id)
        collections.splice(indexToChange, 1)
        collections.splice(order - 1, 0, collectionToChange)

        for (let i = 1; i <= collections.length; i++) {
            collections[i - 1].order = i
            await collections[i - 1].save()
        }

        return collectionToChange
    }
}

export default new CollectionsService()