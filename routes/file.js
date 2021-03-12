import fileContoller from '../controllers/file.js'
import {Router} from 'express'
import {checkToken} from "../middleware/checkToken.js";

const router = Router()

router.post('/file/upload', checkToken, fileContoller.uploadFile)
router.get('/file/list',checkToken, fileContoller.FileList)
router.get('/file/delete/:id', checkToken, fileContoller.deleteFile)
router.get('/file/:id', checkToken, fileContoller.getFileInfo)
router.get('/file/download/:id',checkToken, fileContoller.downloadFile)
router.put('/file/update/:id',checkToken, fileContoller.updateFile)

export default router