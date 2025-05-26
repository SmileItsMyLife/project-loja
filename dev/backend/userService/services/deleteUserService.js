const { Op } = require('sequelize');
const models = require("../models/models")
const { User } = require('../models/models')

module.exports = async function deleteUserService() {
    try {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        // Calcula o timestamp de 10 minutos atrás.

        await User.destroy({
            where: {
                verified: false, // Contas não verificadas
                createdAt: { [Op.lt]: tenMinutesAgo } // Criadas há mais de 10 minutos
            }
        });

        await models.Basket.destroy({
            where: {
                userId: null // Cestas de compras sem usuário associado
            }
        });

        await models.BasketProduct.destroy({
            where: {
                basketId: null // Produtos sem cestas de compras associadas
            }
        });

        console.log('Unverified accounts older than 10 minutes have been deleted.');
    } catch (error) {
        console.error('Error deleting unverified accounts:', error);
    }
}