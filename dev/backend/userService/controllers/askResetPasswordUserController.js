const ApiError = require('../error/ApiError');
const { User } = require('../models/models');
const sendVerificationEmail = require('../services/mailService');
const uuid = require("uuid");
const Joi = require('joi');

module.exports = async function askResetPasswordUserController(req, res, next) {
    try {
        const emailSchema = Joi.string().email().required().messages({
            'string.email': 'O email fornecido não é válido.',
            'string.empty': 'O email não está indicado.',
            'any.required': 'O email é obrigatório.'
        });

        const { error } = emailSchema.validate(req.query.email);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }

        const { email } = req.query;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.notFound("Usuário não encontrado."));
        }

        const resetPasswordToken = uuid.v4();
        const resetPasswordTokenExpAt = new Date(Date.now() + 3600 * 24000); // Expires in 24 hour
        
        await user.update({
            resetPasswordToken,
            resetPasswordTokenExpAt
        });

        const baseUrl = process.env.APP_BASE_URL || 'http://localhost:4243';
        const resetPasswordUrl = `${baseUrl}/new-password?token=${resetPasswordToken}`;

        await sendVerificationEmail(email, resetPasswordUrl);

        return res.status(200).json({ message: "Verifique o seu email para redefinir a palavra-passe." });
    } catch (error) {
        console.error("Erro no pedido de mudança de palavra-passe:", error.message);
        return next(ApiError.internal("Erro interno ao processar o pedido de mudança de palavra-passe."));
    }
};