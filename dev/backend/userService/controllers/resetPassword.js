const bcrypt = require('bcrypt');
const zxcvbn = require('zxcvbn');
const Joi = require('joi'); // Import Joi for validation
const ApiError = require("../error/ApiError");
const { User } = require("../models/models");

module.exports = async function resetPassword(req, res, next) {
    try {
        const schema = Joi.object({
            token: Joi.string().required().messages({
                'string.empty': 'O token é obrigatório.',
                'any.required': 'O token é obrigatório.'
            }),
            password: Joi.string().min(8).required().messages({
                'string.min': 'A palavra-passe deve ter pelo menos 8 caracteres.',
                'string.empty': 'A palavra-passe é obrigatória.',
                'any.required': 'A palavra-passe é obrigatória.'
            })
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }

        const { token, password } = req.body;

        const user = await User.findOne({ where: { resetPasswordToken: token } });
        if (!user) {
            return next(ApiError.notFound("Token inválido ou expirado."));
        }

        if (new Date() > new Date(user.resetPasswordTokenExpAt)) {
            return next(ApiError.badRequest("O token de redefinição de palavra-passe expirou."));
        }

        const { score } = zxcvbn(password);
        if (score < 3) {
            return next(ApiError.badRequest("A palavra-passe é demasiado fraca."));
        }

        const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await user.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpAt: null
        });

        return res.status(200).json({ message: "Palavra-passe atualizada com sucesso." });

    } catch (error) {
        console.error("Erro ao redefinir a palavra-passe:", error.message);
        return next(ApiError.internal("Erro interno ao redefinir a palavra-passe."));
    }
};