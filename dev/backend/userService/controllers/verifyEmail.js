const { User } = require('../models/models');
const ApiError = require('../error/ApiError');

module.exports = async function verifyEmail(req, res, next) {
    try {
        const { token } = req.query;
        if (!token) {
            return next(ApiError.badRequest("Token de verificação ausente."));
        }

        const user = await User.findOne({ where: { verificationToken: token } });
        if (!user) {
            return next(ApiError.notFound("Token inválido."));
        }

        user.verified = true;
        user.verificationToken = null;
        await user.save();

        return res.json({ message: "Conta verificada com sucesso." });
    } catch (error) {
        console.error("Erro na verificação de email:", error);
        return next(ApiError.internal("Erro na verificação de conta."));
    }
};