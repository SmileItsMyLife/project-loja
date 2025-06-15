const Joi = require('joi');
const bcrypt = require('bcrypt');
const generateJwt = require("../services/jwtService");
const ApiError = require("../error/ApiError");
const { User } = require("../models/models");

module.exports = async function loginUserController(req, res, next) {
    try {
        const { email, password } = req.body;

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });
        
        const { error } = schema.validate({ email, password });
        if (error) {
            return next(ApiError.badRequest('Dados inválidos: ' + error.details[0].message));
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.notFound('Utilizador não encontrado!'));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return next(ApiError.badRequest('Palavra-passe incorreta!'));
        }

        // if (!user.verified) {
        //     return next(ApiError.forbidden('Conta ainda não verificada. Verifique seu email.'));
        // }
        const token = generateJwt(user.id, user.email, user.role, user.verified);

        return res.status(200).json({
            message: "Login efetuado com sucesso.",
            token
        });
    } catch (error) {
        console.error("Erro no login:", error);
        return next(ApiError.internal("Erro interno ao processar login."));
    }
};
