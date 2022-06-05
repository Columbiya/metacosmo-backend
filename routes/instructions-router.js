import { Router } from "express";
import instructionsController from "../instructions/instructionsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router()

router.get('/', instructionsController.getAll)
router.post('/', authMiddleware, instructionsController.create)
router.delete('/', authMiddleware, instructionsController.delete)

export default router