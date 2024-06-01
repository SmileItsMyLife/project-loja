const { Basket, BasketProduct, PurchaseBasket, PurchaseProduct, Product } = require('../models/models')
const ApiError = require('../error/ApiError');

class PurchaseController {
    async add(req, res, next){
        try {
            const { id } = req.user;
            const basket = await Basket.findOne({where: {userId: id}})         
            if (!basket) {
                return next(ApiError.notFound("Erro no purchase.controller!")); 
            }
            const basketProducts = await BasketProduct.findAll({where: {basketId: basket.id}})
            if (!basketProducts) {
                return next(ApiError.notFound("O utilizador colocou nada na caixa!"));
            }
            const purchase = await PurchaseBasket.create({userId: id})
            let totalPrice = 0
            const purchaseProducts = await Promise.all(basketProducts.map(async (basketProduct) => {
                await PurchaseProduct.create({productId: basketProduct.productId, purchaseBasketId: purchase.id})
                const product = await Product.findOne({where: {id: basketProduct.productId}})
                await BasketProduct.destroy({where: {id: basketProduct.id}})
                totalPrice += product.value
            }))
            await purchase.update({totalPrice})
            
            return res.json({basket, purchase, basketProducts, purchaseProducts});
        } catch (error) {
            console.log(error.message);
            return next(ApiError.internal("Erro no purchase.controller!"));
        }
    }

    async getUser(req, res, next){
        try {
            const {id} = req.body
            const purchases = await PurchaseBasket.findAll({where: {userId: id}}) 
            return res.json(purchases)
        } catch (error) {
            console.log(error.message);
            return next(ApiError.internal("Erro no purchase.controller!"));
        }
    }
}

module.exports = new PurchaseController()
