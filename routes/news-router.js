import { Router } from 'express'
import newController from '../news/newController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', newController.getAll)
router.get('/:id', newController.getOne)
router.post('/', authMiddleware, newController.create)
router.delete('/', authMiddleware, newController.delete)

export default router