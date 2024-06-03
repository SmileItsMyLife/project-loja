require("dotenv").config()
const express = require("express")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const path = require("path")
const models = require("./models/models")
const { User } = require('./models/models')
const sequelize = require("./db")
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const router = require('./routes/index')
const cron = require('node-cron');
const { Op } = require('sequelize');
const Stripe = require('stripe');

const PORT = process.env.PORT || 5000

const app = express() //Criação do objeto.
const stripe = new Stripe('ваш секретний ключ');
app.use(cors()) //Comunicação com browsers.
app.use(express.json()) //Utilização do JSON formato.
app.use(fileUpload({})) //Receio dos ficheiros.
app.use(express.static(path.resolve(__dirname, "static"))) //Pasra statica.
app.use('/api', router)
app.use(errorHandler)


async function deleteUnverifiedAccounts() {
    try {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
        await User.destroy({
            where: {
                verified: false,
                createdAt: { [Op.lt]: tenMinutesAgo }
            }
        });

        await models.Basket.destroy({
            where: {
                userId: null
            }
        });

        await models.BasketProduct.destroy({
            where: {
                basketId: null
            }
        });

        awai
        console.log('Unverified accounts older than 10 minutes have been deleted.');
    } catch (error) {
        console.error('Error deleting unverified accounts:', error);
    }
}
// Schedule the task to run every minute
cron.schedule('*/10 * * * *', async () => {
    try {
        // Call the method to delete unverified accounts from your UserController
        await deleteUnverifiedAccounts();
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});


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