const fs = require('fs');
const path = require('path');
const { Product, BasketProduct } = require('../models/models');
const ApiError = require('../error/ApiError');

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.query;

        if (!id) {
            return next(ApiError.badRequest("O ID não foi indicado"));
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return next(ApiError.notFound(`O produto com ID: ${id} não foi encontrado`));
        }

        await BasketProduct.destroy({ where: { productId: product.id } })

        const filePath = path.resolve(__dirname, '..', 'static', product.img);

        fs.unlinkSync(filePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        } else {
            console.warn(`Arquivo não encontrado: ${filePath}`);
        }

        await product.destroy();

        return res.status(200).json({ message: "Produto apagado com sucesso" });
    } catch (error) {
        console.log(error.message);
        return next(ApiError.internal("Erro ao excluir o produto"));
    }
}

module.exports = deleteProduct;