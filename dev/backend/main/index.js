require("dotenv").config()
const express = require("express")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const path = require("path")

const sequelize = require("./db")
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const router = require('./routes/index')
const cron = require('node-cron');
const deleteUserService = require('./services/deleteUserService')

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(fileUpload({}))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, "static")))
app.use('/api', router)
app.use(errorHandler)

// Agenda a tarefa para rodar a cada 10 minutos.
cron.schedule('*/10 * * * *', async () => {
    try {
        await deleteUserService();
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

// Função assíncrona para iniciar o servidor.
const start = async () => {
    try {
        await sequelize.authenticate()
        // Autentica a conexão com o banco de dados.

        await sequelize.sync()
        // Sincroniza os modelos com o banco de dados.

        app.listen(PORT, () => console.log(`Servidor iniciado no port ${PORT}`))
        // Inicia o servidor na porta definida.
    } catch (error) {
        console.log(error.message)
        // Loga o erro caso ocorra.
    }
}

start()