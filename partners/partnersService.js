import models from "../models/models.js"
import ApiError from './../error/ApiError.js';
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { readdir } from "fs/promises";
import * as fs from 'fs'

class PartnersService {

    async getAll() {
        const partners = await models.Partner.findAll()
        return partners
    }

    async create(img, link) {
        if (!img) {
            throw ApiError.badRequest('Не введены нужные параметры для создания партнера')
        }

        const __dirname = path.resolve()
        let fileName = uuidv4() + '.png'
        img.mv(path.resolve(__dirname, 'static', 'partners', fileName))

        const createdPartner = await models.Partner.create({img: fileName, link})
        return createdPartner
    }

    async delete(id) {
        if (!id) {
            throw ApiError.badRequest('Не указан Id для удаления партнера')
        }

        const candidate = await models.Partner.findByPk(id)

        if (!candidate) {
            throw ApiError.badRequest('Партнера с таким id не существует')
        }

        const __dirname = path.resolve()
        const files = await readdir(path.resolve(__dirname, 'static', 'partners'))

        for (let file of files) {
            if (file === candidate.img) {
                fs.unlink(path.resolve(__dirname, 'static', 'partners', file), (err) => {
                    if (err) {
                        throw ApiError.internal('Такого файла не существует. Ошибка')
                    }
                })

                break;
            }
        }

        await candidate.destroy()
        return candidate
    }

}

export default new PartnersService()