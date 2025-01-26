require("dotenv").config()
// Carrega as variáveis de ambiente do arquivo .env para process.env.
const express = require("express")
// Importa o framework Express para criar o servidor.
const fileUpload = require("express-fileupload")
// Middleware para lidar com uploads de arquivos.
const cors = require("cors")
// Middleware para habilitar CORS (Cross-Origin Resource Sharing).
const path = require("path")
// Módulo nativo do Node.js para manipulação de caminhos de arquivos e diretórios.
const models = require("./models/models")
// Importa todos os modelos definidos no arquivo models.
const { User } = require('./models/models')
// Importa o modelo User especificamente.
const bodyParser = require('body-parser');

const sequelize = require("./db")
// Importa a configuração do Sequelize para conexão com o banco de dados.

const errorHandler = require('./middleware/ErrorHandlingMiddleware')
// Middleware personalizado para tratamento de erros.

const router = require('./routes/index')
// Importa o roteador principal que contém todas as rotas da aplicação.

const cron = require('node-cron');
// Biblioteca para agendamento de tarefas cron.

const { Op } = require('sequelize');
// Operadores do Sequelize para consultas ao banco de dados.

const Stripe = require('stripe');
// Biblioteca Stripe para pagamentos.

// Define a porta do servidor, usando a variável de ambiente PORT ou 5000 como padrão.
const PORT = process.env.PORT || 5000

const app = express()
// Cria uma instância do Express.

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    appInfo: { // For sample support and debugging, not required for production:
        name: "stripe-samples/accept-a-payment/prebuilt-checkout-page",
        version: "0.0.1",
        url: "https://github.com/stripe-samples"
    }
});
app.use(cors())
app.use(
    express.json({
        // We need the raw body to verify webhook signatures.
        // Let's compute it only when hitting the Stripe webhook endpoint.
        verify: function (req, res, buf) {
            if (req.originalUrl.startsWith('/webhook')) {
                req.rawBody = buf.toString();
            }
        },
    }))
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, "static")))
app.use('/api', router)


app.use(errorHandler)
// Middleware de tratamento de erros personalizado.

// Função assíncrona para deletar contas não verificadas e cestas de compras órfãs.
async function deleteUnverifiedAccounts() {
    try {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        // Calcula o timestamp de 10 minutos atrás.

        await User.destroy({
            where: {
                verified: false, // Contas não verificadas
                createdAt: { [Op.lt]: tenMinutesAgo } // Criadas há mais de 10 minutos
            }
        });

        await models.Basket.destroy({
            where: {
                userId: null // Cestas de compras sem usuário associado
            }
        });

        await models.BasketProduct.destroy({
            where: {
                basketId: null // Produtos sem cestas de compras associadas
            }
        });

        console.log('Unverified accounts older than 10 minutes have been deleted.');
    } catch (error) {
        console.error('Error deleting unverified accounts:', error);
    }
}

// Agenda a tarefa para rodar a cada 10 minutos.
cron.schedule('*/10 * * * *', async () => {
    try {
        await deleteUnverifiedAccounts();
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/checkout-session', async (req, res) => {
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.send(session);
});

app.post('/create-checkout-session', async (req, res) => {
    const domainURL = process.env.DOMAIN;
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Custom Product Name',
                },
                unit_amount: 20000, // Amount in cents (20000 cents = $200.00)
            },
            quantity: 1
        }],
        success_url: `http://localhost:5173/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/canceled.html`,
        metadata: {
            userId: 123, // Include the user ID in metadata
        }
    });

    return res.redirect(303, session.url);
});

app.post('/webhook', async (req, res) => {
    let event;

    if (process.env.STRIPE_WEBHOOK_SECRET) {
        let signature = req.headers['stripe-signature'];

        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.` + err.message);
            return res.sendStatus(400);
        }
    } else {
        event = req.body;
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;
        console.log(`🔔  Payment received! Id de utilizador: ${userId}`);
    }

    res.sendStatus(200);
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
// Chama a função para iniciar o servidor.