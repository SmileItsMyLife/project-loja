const { v4: uuidv4 } = require('uuid');
const ApiError = require("../error/ApiError");
const { User } = require("../models/models");
const sendVerificationEmail = require('../services/mailService');

module.exports = async function resendEmail(req, res, next) {
    try {
        const userData = req.user;

        const user = await User.findByPk(userData.id);
        if (!user || user.verified == true) {
            return next(ApiError.notFound("Error in send email."));
        }

        const newVerificationToken = uuidv4();

        await user.update({ verificationToken: newVerificationToken });

        const baseUrl = process.env.APP_BASE_URL || 'http://localhost:4243';
        const verificationUrl = `${baseUrl}/api/users/verify?token=${newVerificationToken}`;
        await sendVerificationEmail(user.email, verificationUrl);

        return res.status(200).json({ message: "Email de verificação reenviado com sucesso." });
    } catch (error) {
        console.error('Erro no reenvio de email de verificação:', error.message);
        return next(ApiError.internal("Erro ao reenviar email de verificação."));
    }
};
