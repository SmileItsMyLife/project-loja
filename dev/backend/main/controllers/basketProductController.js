const { Basket, Product, BasketProduct } = require('../models/models')
const ApiError = require('../error/ApiError');
//lol
class BasketProductController {
    async add(req, res, next) {
        try {
            const { id } = req.user
            if (!id) {
                return next(ApiError.unAutorized("Utilizador não autorizado"))
            }
            const { productId } = req.body
            if (!productId) {
                return next(ApiError.badRequest("O id do produto não foi indicado"))
            }
            const basket = await Basket.findOne({ where: { userId: id } })
            if (!basket) {
                return next(ApiError.notFound("Utilizador não tem caixa"))
            }
            const product = await Product.findByPk(productId)
            if (!product) {
                return next(ApiError.notFound(`Produto com id: ${productId} não foi encontrado`))
            }
            const result = await BasketProduct.create({ basketId: basket.id, productId: product.id })
            return res.status(200).json({ result })
        } catch (error) {
            console.log(error.message)
            return next(ApiError.internal("Erro durante de colocamento do produto ao caixa"))
        }
    }

    async remove(req, res, next) {
        try {
            const { id } = req.user
            if (!id) {
                return next(ApiError.unAutorized("Utilizador não autorizado"))
            }
            const { productId } = req.query
            if (!productId) {
                return next(ApiError.badRequest("O id do produto não foi indicado"))
            }
            const basket = await Basket.findOne({ where: { userId: id } })
            if (!basket) {
                return next(ApiError.notFound("Utilizador não tem caixa"))
            }
            
            await BasketProduct.destroy({ where: { basketId: basket.id, id: productId } })
            return res.status(200).json({ message: "O produto foi retirado da caixa com sucesso" })
        } catch (error) {
            console.log(error.message)
            return next(ApiError.internal("Erro durante de retiramento do produto da caixa"))
        }
    }

    async cleanAll(req, res, next) {
        try {
            const { id } = req.user
            if (!id) {
                return next(ApiError.unAutorized("Utilizador não autorizado"))
            }
            const basket = await Basket.findOne({ where: { userId: id } })
            if (!basket) {
                return next(ApiError.notFound("Utilizador não tem caixa"))
            }
            await BasketProduct.destroy({ where: { basketId: basket.id } })
            return res.status(200).json({ message: "Todos produtos foram retirados da caixa" })
        } catch (error) {
            console.log(error.message)
            return next(ApiError.internal("Erro durante de limpeza de caixa"))
        }
    }

    async getAll(req, res, next) {
        try {
            const { id } = req.user;
            if (!id) {
                return next(ApiError.unAutorized("Utilizador não autorizado"));
            }
            const basket = await Basket.findOne({ where: { userId: id } });
            if (!basket) {
                return next(ApiError.notFound("Utilizador não tem caixa"));
            }
    
            const basketProducts = await BasketProduct.findAll({ where: { basketId: basket.id } });
            const productPromises = basketProducts.map(async element => {
                const productData = await Product.findOne({ where: { id: element.productId } });
                return {
                    id: element.id,
                    basketId: element.basketId, // ID do produto em basketProduct
                    productData: productData // Dados do produto
                };
            });
    
            const productsInBasket = await Promise.all(productPromises);
        
            return res.status(200).json({ productsInBasket });
        } catch (error) {
            console.log(error.message);
            return next(ApiError.internal("Erro durante de limpeza de caixa"));
        }
    }
}

module.exports = new BasketProductController()
