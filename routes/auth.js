import authController from '../controllers/auth.js'
import {Router} from 'express'
import {checkToken} from "../middleware/checkToken.js";

const router = Router()

router.post('/signup', authController.signUp)
router.post('/signin', authController.signIn)
router.post('/signin/new_token', authController.refreshToken)
router.get('/logout', checkToken,authController.logout)


export default router