const { Op } = require('sequelize');
const { User, Basket } = require('../models/models');
const cron = require('node-cron');

module.exports = async function deleteUserExpiredService() {
    cron.schedule('*/10 * * * *', async () => {
        try {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

            const deletedUsers = await User.destroy({
                where: {
                    verified: false, // Contas não verificadas
                    createdAt: { [Op.lt]: tenMinutesAgo } // Criadas há mais de 10 minutos
                }
            });

            const deletedBaskets = await Basket.destroy({
                where: {
                    userId: null // Cestas de compras sem usuário associado
                }
            });

            console.log(`${deletedUsers} unverified accounts and ${deletedBaskets} orphaned baskets deleted.`);
        } catch (error) {
            console.error('Error deleting unverified accounts:', error);
        }
        console.log('Periodic cleanup executed.');
    });
}