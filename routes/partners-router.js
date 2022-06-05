import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import partnersController from "../partners/partnersController.js";

const router = Router()

router.get('/', partnersController.getAll)
router.post('/', authMiddleware, partnersController.create)
router.delete('/', authMiddleware, partnersController.delete)

export default router