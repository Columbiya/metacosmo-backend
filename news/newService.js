import models from '../models/models.js'
import ApiError from './../error/ApiError.js';
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path'
import { readdir } from 'fs/promises';
import * as fs from 'fs'

const attributes = ['img', 'createdAt', 'subtitle', 'title', 'author', 'hider', 'id']

class NewService {

    async getAll(page, limit) {
        let offset = page * limit - limit
        const news = await models.New.findAndCountAll({limit: +limit, offset: +offset, attributes, order: [['createdAt', 'DESC']]})
        return news
    }

    async getOne(id) {
        if (!id) {
            throw ApiError.badRequest('Не указано ID новости')
        }

        const news = await models.New.findByPk(id)
        return news
    }

    async create({ subtitle, title, author, boldText, text, img, twoColumnContentFirst, twoColumnContentSecond, oneColumnContent, hider, quote }) {
        if (!title || !subtitle || !author || !img || !boldText || !text || !twoColumnContentFirst || !twoColumnContentSecond || !oneColumnContent || !quote) {
            throw ApiError.badRequest('Все required поля не были переданы в body')
        }
        if (Array.isArray(subtitle)) {
            throw ApiError.badRequest('subtitle должен быть строкой с двумя частями, разбитыми символом |||')
        }

        const subtitles = subtitle.split('|||')
        if (subtitles.length !== 2) {
            throw ApiError.badRequest('subtitle должен быть строкой с двумя частями, разбитыми символом |||')
        }

        const candidate = await models.New.findOne({where: {title}})

        if (candidate) {
            throw ApiError.badRequest('Такая новость уже существует')
        }

        const resultHider = hider ? hider: 'light'

        const __dirname = path.resolve()
        let fileName = uuidv4() + '.jpg'
        img.mv(path.resolve(__dirname, 'static', fileName))

        const CreatedNew = await models.New.create({subtitle, title, author, boldText, text, twoColumnContentFirst, twoColumnContentSecond, oneColumnContent, hider: resultHider, quote, img: fileName})
        return CreatedNew
    }

    async delete(id) {
        const __dirname = path.resolve()

        if (!id) {
            throw ApiError.badRequest('Не указан id')
        }

        const candidate = await models.New.findByPk(id)
        if (!candidate) {
            throw ApiError.badRequest('статьи с указанным id не существует')
        }

        const files = await readdir(path.resolve(__dirname, 'static'))

        for (let file of files) {
            if (file === candidate.img) {
                fs.unlink(path.resolve(__dirname, 'static', file), (err) => {
                    if (err) {
                        throw ApiError.internal('Такого файла не существует. Ошибка')
                    }
                })

                break;
            }
        }

        candidate.destroy()
        return candidate
    }

}

export default new NewService()