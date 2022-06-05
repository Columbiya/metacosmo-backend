import { Router } from 'express';
import AuthController from '../auth/AuthController.js';

const router = Router()

router.get('/check', AuthController.check)
router.post('/login', AuthController.login)

export default router