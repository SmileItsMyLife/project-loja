const { Product } = require("../../models");
const ApiError = require("../../error/ApiError");
const Sequelize = require("sequelize");

const recommends = async (req, res, next) => {
    try {
        // Check total products count
        const count = await Product.count();
        console.log("Total products in DB:", count); // Debugging log

        if (count === 0) {
            return res.status(200).json([]); // Return an empty array if no products
        }

        const limit = count < 10 ? count : 10;

        const products = await Product.findAll({
            order: Sequelize.literal("RAND()"), // Use "RANDOM()" for PostgreSQL
            limit,
        });

        console.log("Products retrieved:", products); // Debugging log
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return next(ApiError.internal("Erro ao obter recomendações de produtos"));
    }
}

module.exports = recommends;