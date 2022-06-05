import { Router } from 'express'
import newsRouter from './news-router.js';
import articlesRouter from './articles-router.js';
import authRouter from './authRouter.js';
import partnersRouter from './partners-router.js'
import collectionsRouter from './collections-router.js'
import instructionsRouter from './instructions-router.js'
import emailRouter from './email-router.js'
import tokenRouter from './tokenRouter.js'

const router = Router()

router.use('/news', newsRouter)
router.use('/articles', articlesRouter)
router.use('/auth', authRouter)
router.use('/partners', partnersRouter)
router.use('/collections', collectionsRouter)
router.use('/instructions', instructionsRouter)
router.use('/email', emailRouter)
router.use('/token', tokenRouter)

export default router