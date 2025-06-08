const { Product } = require('../../models/models');
const ApiError = require('../../error/ApiError');
const { Op } = require('sequelize');

const getAllProducts = async (req, res, next) => {
    try {
        let { typeId, limit, page, sortedBy, name } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 2;
        let offset = (page - 1) * limit;

        let whereCondition = {};
        if (typeId && typeId != 0) {
            whereCondition.typeId = typeId;
        }
        if (name) {
            whereCondition.name = { [Op.like]: `%${name}%` };
        }

        let order = [];
        if (sortedBy === "oldest") {
            order.push(["createdAt", "ASC"]);
        } else if (sortedBy === "newest") {
            order.push(["createdAt", "DESC"]);
        }

        const products = await Product.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order,
        });

        const totalPages = Math.ceil(products.count / limit);
        return res.status(200).json({ products, totalPages });
    } catch (error) {
        console.error(error.message);
        return next(ApiError.internal("Erro ao buscar produtos"));
    }
};

module.exports = getAllProducts;