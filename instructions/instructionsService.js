import models from "../models/models.js"
import ApiError from './../error/ApiError.js';
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { readdir } from "fs/promises";
import * as fs from 'fs'

class InstructionsService {

    async getAll(page, limit) {
        const offset = page * limit - limit
        const collections = await models.Instruction.findAndCountAll({offset, limit: +limit, order: [['createdAt', 'DESC']]})
        return collections
    }

    async create(name, description, img, link) {
        if (!name  || !description || !img || !link) {
            throw ApiError.badRequest('Не указаны нужные параметры для создания коллекции')
        }
        
        const candidate = await models.Instruction.findOne({where: {name}})

        if (candidate) {
            throw ApiError.badRequest('Коллекция с указанным именем уже существует')
        }

        const __dirname = path.resolve()
        const fileName = uuidv4() + '.jpg'
        await img.mv(path.resolve(__dirname, 'static', 'instructions', fileName))

        const createdCollection = await models.Instruction.create({ name, description, img: fileName, link })
        return createdCollection
    }

    async delete(id) {
        if (!id) {
            throw ApiError.badRequest('Не указан id коллекции, которую хотите удалить')
        }

        const candidate = await models.Instruction.findByPk(id)
        if (!candidate) {
            throw ApiError.badRequest('Коллекции с указанным id не существует')
        }

        const __dirname = path.resolve()
        const files = await readdir(path.resolve(__dirname, 'static', 'instructions'))
        
        for (let file of files) {
            if (file === candidate.img) {
                fs.unlink(path.resolve(__dirname, 'static', 'instructions', file), (err) => {
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
}

export default new InstructionsService()