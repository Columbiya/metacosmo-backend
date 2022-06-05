import { Router } from "express";
import collectionsController from "../collections/collectionsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router()

router.get('/', collectionsController.getAll)
router.post('/', authMiddleware, collectionsController.create)
router.delete('/', authMiddleware, collectionsController.delete)
router.post('/change', authMiddleware, collectionsController.changeOrder)

export default router