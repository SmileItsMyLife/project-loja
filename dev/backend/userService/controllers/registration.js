const sequelize = require("../db");
const Joi = require('joi');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const zxcvbn = require('zxcvbn');
const axios = require('axios');

const generateJwt = require("../services/jwtService");
const sendVerificationEmail = require('../services/mailService');
const ApiError = require("../error/ApiError");

const { User, Basket } = require("../models/models");

module.exports = async function registration(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
        const { email, password } = req.body;

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required()
        });

        const { error } = schema.validate({ email, password });
        if (error) {
            return next(ApiError.badRequest('Dados inválidos: ' + error.details[0].message));
        }

        // Verifica se usuário já existe
        const candidate = await User.findOne({ where: { email }, transaction: transaction });
        if (candidate) {
            return next(ApiError.conflict('Não foi possível completar o registro.'));
        }

        const passwordStrength = zxcvbn(password);
        if (passwordStrength.score < 3) {
            return next(ApiError.badRequest('A senha é muito fraca.'));
        }

        const verificationToken = uuid.v4();
        const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '5');
        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            email,
            password: hashPassword,
            verificationToken
        }, { transaction: transaction });

        await Basket.create({ userId: user.id }, { transaction: transaction });

        const baseUrl = process.env.APP_BASE_URL || 'http://localhost:4243';
        const verificationUrl = `${baseUrl}/api/users/verify?token=${verificationToken}`;

        await sendVerificationEmail(email, verificationUrl);

        const token = generateJwt(user.id, user.email, user.role, user.verified);
        
        await transaction.commit();

        return res.status(200).json({ token });
    } catch (error) {
        await transaction.rollback();
        console.error('Error in registration controller:', error.message);
        return next(ApiError.internal("Erro durante o registro!"));
    }
}