import infoController from '../controllers/info.js'
import {Router} from 'express'
import {checkToken} from "../middleware/checkToken.js";

const router = Router()

router.get('/info', checkToken,infoController.getInfo)

export default router