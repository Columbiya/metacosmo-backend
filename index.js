import express from "express"
import sequelize from './db.js'
import router from "./routes/index.js"
import errorHandlingMiddleware from './middleware/errorHandlingMiddleware.js';
import fileUpload from 'express-fileupload'
import * as path from 'path'
import cors from 'cors'

const PORT = process.env.PORT || 5000
const __dirname = path.resolve()
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(express.static(path.resolve(__dirname, 'static', 'partners')))
app.use(express.static(path.resolve(__dirname, 'static', 'collections')))
app.use(express.static(path.resolve(__dirname, 'static', 'instructions')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorHandlingMiddleware)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on ${PORT} port`))
    } catch(e) {
        console.log(e)
    }
}

start()