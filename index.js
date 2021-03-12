import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import authRouter from './routes/auth.js'
import infoRouter from './routes/info.js'
import fileRouter from './routes/file.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use(express.static('static'))


app.use('/',authRouter)
app.use('/',infoRouter)
app.use('/',fileRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running in port: ${PORT}`)
})


