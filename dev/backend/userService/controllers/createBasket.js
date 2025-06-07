const { User, Basket } = require('../models/models');
const ApiError = require('../error/ApiError');

module.exports = async function createBasket(req, res, next) {
    try {
        const { email } = req.query;

        if (!email) {
            return next(ApiError.badRequest("O email não foi fornecido."));
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.notFound("Utilizador não encontrado."));
        }

        if (!user.verified) {
            return next(ApiError.forbidden("O email do utilizador não está verificado. A criação da cesta foi negada."));
        }

        const existingBasket = await Basket.findOne({ where: { userId: user.id } });
        if (existingBasket) {
            return res.status(200).json({ message: "A cesta já existe para este usuário." });
        }

        const newBasket = await Basket.create({ userId: user.id });
        return res.status(201).json({ message: "Cesta criada com sucesso.", basket: newBasket });
    } catch (error) {
        console.error("Erro ao criar cesta:", error.message);
        return next(ApiError.internal("Erro interno ao criar cesta."));
    }
};