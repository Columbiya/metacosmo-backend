import { Router } from 'express'
import articlesController from '../articles/articlesController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', articlesController.getAll)
router.get('/:id', articlesController.getOne)
router.post('/', authMiddleware, articlesController.create)
router.delete('/', authMiddleware, articlesController.delete)

export default router