require("dotenv").config()
const express = require("express")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const path = require("path")
const models = require("./models/models")
const sequelize = require("./db")
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const router = require('./routes/index')

const PORT = process.env.PORT || 5000

const app = express() //Criação do objeto.
app.use(cors()) //Comunicação com browsers.
app.use(express.json()) //Utilização do JSON formato.
app.use(fileUpload({})) //Receio dos ficheiros.
app.use(express.static(path.resolve(__dirname, "static"))) //Pasra statica.
app.use('/api', router)
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Servidor iniciado no port ${PORT}`))
    } catch (error) {
        console.log(error.message)
    }
}

start()





