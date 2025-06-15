const ApiError = require("../error/ApiError");
const { Product } = require("../models/models");

const getOneProduct = async (req, res, next) => {
    try {
        const { id } = req.params; // Extrai o parâmetro de ID da solicitação

        // Encontra o produto pelo ID
        const product = await Product.findOne({ where: { id } });

        // Retorna o produto encontrado como uma resposta JSON
        return res.status(200).json(product);
    } catch (error) {
        // Se ocorrer um erro, registra o erro e retorna um erro interno
        return next(ApiError.internal("Erro no levantamento de um produto"));
    }
}

module.exports = getOneProduct;