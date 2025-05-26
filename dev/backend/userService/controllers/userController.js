const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const { User } = require('../models/models');
const sendVerificationEmail = require('../services/mailService');
const uuid = require("uuid");
const zxcvbn = require('zxcvbn')

class UserController {
    async resendEmail(req, res, next) {
        try {
            const user = req.user;
            const search = await User.findByPk(user.id);
            if (!search) {
                next(ApiError.notFound("Utilizador não encontrado"));
            }
            // Verifica se o usuário existe.

            await sendVerificationEmail(search.email, `http://localhost:4243/api/users/verificate?token=${search.verificationToken}`);
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
