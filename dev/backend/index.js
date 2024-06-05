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

const stripe = new Stripe('ваш секретний ключ'); 
// Inicializa o Stripe com a chave secreta (substituir 'ваш секретний ключ' pela sua chave real).

app.use(cors()) 
// Habilita CORS para permitir requisições de diferentes origens.

app.use(express.json()) 
// Middleware para parsear requisições com JSON.

app.use(fileUpload({})) 
// Middleware para habilitar uploads de arquivos.

app.use(express.static(path.resolve(__dirname, "static"))) 
// Middleware para servir arquivos estáticos da pasta "static".
app.use(bodyParser.raw({ type: 'application/json' }));


app.use('/api', router) 


app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Caixa de Pagamento',
            },
            unit_amount: 2000, // preço em centavos (20 USD)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });
  
    res.json({ id: session.id });
  });
// Usa o roteador principal para todas as rotas que começam com '/api'.

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
