require("dotenv").config()
const express = require('express')
const cors = require('cors');
const sequelize = require('./db')
const fileUpload = require('express-fileupload')
const router = require("./routes/index.js")

const PORT = process.env.PORT || 5001
const app = express()
app.use(cors())
app.use(fileUpload({}))
app.use(express.json())
app.use("/api", router)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Servidor iniciado no port ${PORT}`))
    } catch (error) {
        console.log(`Error in connection to database oe in starting app! Error message:${error.message}`)
    }
}

start()