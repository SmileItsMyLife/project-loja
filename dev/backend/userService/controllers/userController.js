const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const { User } = require('../models/models');
const sendVerificationEmail = require('../services/mailService');
const uuid = require("uuid");
const zxcvbn = require('zxcvbn');
const generateJwt = require("../services/jwtService")

class UserController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(ApiError.badRequest('Falta de email ou palavra-passe!'));
            }
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.notFound('Utilizador não é encontrado!'));
            }
            const comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return next(ApiError.badRequest('Palavra-passe errado!'));
            }
            const token = generateJwt(user.id, user.email, user.role, user.verified);
            console.log(token)
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
                <a href="http://localhost:5173/" class="btn btn-success">Yanit Shop</a>
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

            await sendVerificationEmail(search.email, `http://localhost:4242/api/users/verificate?token=${search.verificationToken}`);
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
