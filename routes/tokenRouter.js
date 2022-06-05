
import { Router } from 'express';
import tokenController from '../tokens/tokenController.js';

const router = Router()

router.get('/', tokenController.getAll)
router.get('/daily', tokenController.getDailyWithPrev)
router.post('/', tokenController.createToken)
router.get('/fetch', tokenController.fetchTokens)

export default router