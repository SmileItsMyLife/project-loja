const ApiError = require('../error/ApiError');
// Importa a classe ApiError para tratamento de erros personalizados.

const bcrypt = require('bcrypt');
// Importa a biblioteca bcrypt para criptografar senhas.

const jwt = require('jsonwebtoken');
// Importa a biblioteca jsonwebtoken para gerar e verificar tokens JWT.

const { User, Basket } = require('../models/models');
// Importa os modelos User e Basket.

const sendVerificationEmail = require('../services/mailService');
// Importa o serviço para envio de e-mails de verificação.

const uuid = require("uuid");
// Importa a biblioteca uuid para gerar identificadores únicos.

const EmailValidator = require('email-validator');
// Importa a biblioteca para validação de e-mails.

const zxcvbn = require('zxcvbn');
// Importa a biblioteca para verificar a força da senha.

const sequelize = require("../db");
// Importa a configuração do Sequelize para conexão com o banco de dados.

const cron = require('node-cron');
// Importa a biblioteca node-cron para agendamento de tarefas cron.

const generateJwt = (id, email, role, verified) => {
    return jwt.sign(
        { id, email, role, verified },
        process.env.SECRET_KEY,
        { expiresIn: '924h' }
    );
};
// Função para gerar um token JWT com base nas informações do usuário.

class UserController {
    async registration(req, res, next) {
        const t = await sequelize.transaction();
        // Inicia uma transação para garantir a integridade dos dados.

        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(ApiError.badRequest('Falta de email ou palavra-passe!'));
            }
            // Verifica se o email e a senha foram fornecidos.

            const candidate = await User.findOne({ where: { email }, transaction: t });
            if (candidate) {
                return next(ApiError.conflict('Utilizador com este email já existe!'));
            }
            // Verifica se o email já está em uso.

            if (!EmailValidator.validate(email)) {
                return next(ApiError.badRequest('Formato de e-mail inválido.'));
            }
            // Valida o formato do email.

            const passwordStrength = zxcvbn(password);
            if (passwordStrength.score < 3) {
                return next(ApiError.badRequest('A senha é muito fraca.'));
            }
            // Verifica a força da senha.

            const verificationToken = uuid.v4();
            // Gera um token de verificação.

            const hashPassword = await bcrypt.hash(password, 5);
            // Criptografa a senha.

            const user = await User.create({ email, password: hashPassword, verificationToken }, { transaction: t });
            // Cria o usuário no banco de dados.

            await Basket.create({ userId: user.id }, { transaction: t });
            // Cria uma cesta de compras para o usuário.

            await sendVerificationEmail(email, `http://localhost:5000/api/users/verificate?token=${verificationToken}`);
            // Envia o e-mail de verificação.

            const token = generateJwt(user.id, user.email, user.role, user.verified);
            // Gera um token JWT para o usuário.

            await t.commit();
            // Confirma a transação.

            return res.status(200).json({ token });
            // Retorna o token JWT como resposta.
        } catch (error) {
            await t.rollback();
            // Reverte a transação em caso de erro.

            console.log(error.message);
            return next(ApiError.internal("Erro durante o registro!"));
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(ApiError.badRequest('Falta de email ou palavra-passe!'));
            }
            // Verifica se o email e a senha foram fornecidos.

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.notFound('Utilizador não é encontrado!'));
            }
            // Verifica se o usuário existe.

            const comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return next(ApiError.badRequest('Palavra-passe errado!'));
            }
            // Verifica se a senha está correta.

            const token = generateJwt(user.id, user.email, user.role, user.verified);
            // Gera um token JWT para o usuário.

            return res.status(200).json({ token });
            // Retorna o token JWT como resposta.
        } catch (error) {
            console.log(error.message);
            return next(ApiError.internal("Erro no login!"));
        }
    }

    async check(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id);
            const token = generateJwt(user.id, user.email, user.role, user.verified);
            // Gera um novo token JWT para o usuário autenticado.

            return res.status(200).json({ token });
            // Retorna o token JWT como resposta.
        } catch (error) {
            console.log(error.message);
            return next(ApiError.internal("Erro durante o autenificação!"));
        }
    }

    async verificate(req, res, next) {
        try {
            const { token } = req.query;
            let titulo = "Email Verificado";
            let corpo = "O seu endereço de correio eletrónico foi verificado com sucesso. Pode agora aceder a todas as funcionalidades do nosso serviço.";

            const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Verified</title>
              <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
              <style>
                body {
                  background-color: #f7f7f7;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                }
                .verification-container {
                  background: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  text-align: center;
                }
                .verification-container .icon {
                  font-size: 50px;
                  color: #28a745;
                }
                .verification-container h1 {
                  font-size: 24px;
                  margin-top: 20px;
                  color: #333;
                }
                .verification-container p {
                  color: #666;
                }
                .verification-container .btn {
                  margin-top: 20px;
                }
              </style>
            </head>
            <body>
            
              <div class="verification-container">
                <div class="icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <h1>${titulo}</h1>
                <p>${corpo}</p>
                <a href="http://localhost:5173/" class="btn btn-success">Tricô Shop</a>
              </div>
            
              <script src="https://kit.fontawesome.com/a076d05399.js"></script>
              <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
              <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
              <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
            </body>
            </html>`;

            if (!token) {
                titulo = "Erro durante de verificação";
                corpo = "O token não foi encontrado";
                return res.status(400).send(htmlContent);
            }
            // Verifica se o token de verificação está presente.

            const user = await User.findOne({ where: { verificationToken: token } });
            if (!user) {
                titulo = "Erro durante de verificação";
                corpo = "É possivel que o a vossa conta já foi verificada";
                return res.status(400).send(htmlContent);
            }
            // Verifica se o usuário com o token de verificação existe.

            if (user.verified) {
                titulo = "Conta verificada!";
                corpo = "A vossa conta já foi verificada!";
                return res.status(400).send(htmlContent);
            }
            // Verifica se o usuário já foi verificado.

            await user.update({ verified: true, verificationToken: null });
            // Atualiza o status do usuário para verificado e remove o token de verificação.

            return res.status(200).send(htmlContent);
        } catch (error) {
            console.log(error.message);
            return next(ApiError.internal("Erro na verificação"));
        }
    }

    async resendEmail(req, res, next) {
        try {
            const user = req.user;
            const search = await User.findByPk(user.id);
            if (!search) {
                next(ApiError.notFound("Utilizador não encontrado"));
            }
            // Verifica se o usuário existe.

            await sendVerificationEmail(search.email, `http://localhost:5000/api/users/verificate?token=${search.verificationToken}`);
            // Reenvia o e-mail de verificação.

            return res.status(200).json({ message: "Email foi reenviado" });
        } catch (error) {
            console.log(error.message);
            return next(ApiError.internal("Erro no resend email"));
        }
    }

    async askResetPassword(req, res, next) {
        try {
            const { email } = req.query;
            if (!email) {
                return next(ApiError.badRequest("O email não está indicado"));
            }
            // Verifica se o email foi fornecido.

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.badRequest("O token errado"));
            }
            // Verifica se o usuário com o email fornecido existe.

            const resetPasswordToken = uuid.v4();
            await user.update({ resetPasswordToken });
            // Gera um token de redefinição de senha e o atualiza no banco de dados.

            await sendVerificationEmail(email, `http://localhost:5173/new-password?token=${resetPasswordToken}`);
            // Envia o e-mail de redefinição de senha.

            return res.status(200).json({ message: "Verifica o seu email" });
        } catch (error) {
            console.log(error.message);
            return next(ApiError.internal("Erro no pedido de mudança de palavra-passe"));
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                return next(ApiError.badRequest("O token ou/e palavra-passe não está/am indicado/s"));
            }
            // Verifica se o token e a senha foram fornecidos.

            const user = await User.findOne({ where: { resetPasswordToken: token } });
            if (!user) {
                return next(ApiError.notFound("Token errado"));
            }
            // Verifica se o usuário com o token de redefinição de senha existe.

            const passwordStrength = zxcvbn(password);
            if (passwordStrength.score < 3) {
                return next(ApiError.badRequest('A senha é muito fraca.'));
            }
            // Verifica a força da nova senha.

            const hashPassword = await bcrypt.hash(password, 5);
            await user.update({ password: hashPassword, resetPasswordToken: null });
            // Atualiza a senha do usuário no banco de dados e remove o token de redefinição.

            return res.status(200).json({ message: "A palavra-passe foi mudada" });
        } catch (error) {
            console.log(error.message);
            return next(ApiError.internal("Erro na mudança de palavra-passe"));
        }
    }
}

module.exports = new UserController();
// Exporta uma instância da classe UserController.
