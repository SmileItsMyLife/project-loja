process.on('SIGTERM', () => {
    console.log('💡 SIGTERM received. Shutting down gracefully.');
    process.exit(0);
  });

require("dotenv").config()
const express = require('express')
const cors = require('cors');
const sequelize = require('./db')
const fileUpload = require('express-fileupload')
const router = require("./routes/index.js");
const deleteUserExpiredService = require("./services/deleteUserExpiredService.js");

const PORT = process.env.PORT || 5001
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
        await sequelize.sync({ alter: true });

        await deleteUserExpiredService()

        app.listen(PORT, () => console.log(`Servidor iniciado no port ${PORT}`))
    } catch (error) {
        console.log(`Error in connection to database oe in starting app! Error message:${error.message}`)
    }
}

start()