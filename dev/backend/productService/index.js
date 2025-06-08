require("dotenv").config()
const express = require('express')
const cors = require('cors');
const sequelize = require('./db.js')
const fileUpload = require('express-fileupload')
const router = require("./routes/index.js");

const PORT = process.env.PORT || 4245
const app = express()
app.use(cors())
app.use(fileUpload({}))
app.use(express.json())
app.use("/api", router)

const start = async () => {
    try {
        await sequelize.authenticate()
        if (process.env.NODE_ENV === 'development') {
            console.log('Running Sequelize sync with alter:true');
        }

        //If you need to update database by changing model, put "alter: true" below this line:
        await sequelize.sync({ alter: false });

        await deleteUserExpiredService()

        app.listen(PORT, () => console.log(`Servidor iniciado no port ${PORT}`))
    } catch (error) {
        console.log(`Error in connection to database oe in starting app! Error message:${error.message}`)
    }
}

start()