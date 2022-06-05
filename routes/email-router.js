import { Router } from "express";
import emailController from "../emails/emailController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router()

router.post('/subscribe', emailController.subscribe)
router.post('/send-feedback', emailController.sendFeedback)
router.get('/activate/:link', emailController.activate)
router.get('/unsubscribe/:link', emailController.unsubscribe)
router.get('/', authMiddleware, emailController.getAllWithTxt)

export default router