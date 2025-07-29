require("dotenv").config()
const express = require('express')
const cors = require('cors');
const sequelize = require('./db')
const fileUpload = require('express-fileupload')
const router = require("./routes/index.js");

const initializeRootUser = require("./services/initializeRootUserService");
const deleteUserExpiredService = require('./services/deleteUserExpiredService');
const sendVerificationEmail = require('./services/mailService');

const PORT = process.env.PORT || 4243
const app = express()
app.use(cors())
app.use(fileUpload({}))
app.use(express.json())
app.use("/api", router)

app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
});

const start = async () => {
    try {
        await sequelize.authenticate()
        if (process.env.NODE_ENV === 'development') {
            console.log('Running Sequelize sync with alter:true');
        }

        await sequelize.sync({ alter: false });

        await initializeRootUser();

        await sendVerificationEmail("test@yanit.com", "Teste de email de verificação");

        await deleteUserExpiredService();

        app.listen(PORT, "0.0.0.0", () => console.log(`Servidor iniciado no port ${PORT}`))
    } catch (error) {
        console.log(`Error in connection to database in starting app! Error message:${error.message}`)
    }
}

start()