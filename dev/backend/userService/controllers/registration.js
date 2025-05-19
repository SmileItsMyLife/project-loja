const sequelize = require("../db");
const Joi = require('joi');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const zxcvbn = require('zxcvbn');

const generateJwt = require("../services/jwtService");
const sendVerificationEmail = require('../services/mailService');
const ApiError = require("../error/ApiError");

const { User, Basket } = require("../models/models"); // Supondo que você exporte os models assim

module.exports = async function registration(req, res, next) {
    const t = await sequelize.transaction();
    try {
        const { email, password } = req.body;

        // Validação de esquema com Joi
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required()
        });
        const { error } = schema.validate({ email, password });
        if (error) {
            return next(ApiError.badRequest('Dados inválidos: ' + error.details[0].message));
        }

        // Verifica se usuário já existe
        const candidate = await User.findOne({ where: { email }, transaction: t });
        if (candidate) {
            return next(ApiError.conflict('Não foi possível completar o registro.'));
        }

        // Verifica força da senha
        const passwordStrength = zxcvbn(password);
        if (passwordStrength.score < 3) {
            return next(ApiError.badRequest('A senha é muito fraca.'));
        }

        // Cria usuário e cesta
        const verificationToken = uuid.v4();
        const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '5');
        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            email,
            password: hashPassword,
            verificationToken
        }, { transaction: t });

        await Basket.create({ userId: user.id }, { transaction: t });

        // Envia email de verificação
        const baseUrl = process.env.APP_BASE_URL || 'http://localhost:4242';
        await sendVerificationEmail(email, `${baseUrl}/api/users/verificate?token=${verificationToken}`);

        // Gera token JWT
        const token = generateJwt(user.id, user.email, user.role, user.verified);
        await t.commit();

        return res.status(200).json({ token });
    } catch (error) {
        await t.rollback();
        console.error('Erro no registro:', error);
        return next(ApiError.internal("Erro durante o registro!"));
    }
}