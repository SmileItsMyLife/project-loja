const { Product, Rating } = require('../models/models')
const ApiError = require('../error/ApiError');

class RatingController {
    async add(req, res, next){
        try {
            const { id } = req.user;
            const { rating, productId } = req.body;
        
            // Check if rating and productId are provided
            if (!rating || !productId) {
                return next(ApiError.badRequest("Não todos dados foram insiridos"))
            }

            if (rating > 5 || rating < 0){
                return next(ApiError.badRequest("O rating saiu de zona aceitavel"))
            }

            const userRate = await Rating.findOne({where: {userId: id, productId}})
            if (userRate){
                return next(ApiError.conflict("O vosso voto já foi registrado"))
            }
        
            const product = await Product.findByPk(productId);
        
            // Check if product exists
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            await Rating.create({ userId: id, productId, rate: rating });
            const rates = await Rating.findAndCountAll({ where: { productId } });
            
            // Calculate average rating only if there are ratings
            let average = 0;
            if (rates.count > 0) {
                const sumRate = rates.rows.reduce((sum, rating) => sum + rating.rate, 0);
                average = sumRate / rates.count;
            }
        
            // Update product's rating
            await product.update({ rating: average });
        
            return res.json({ rate: average });
        } catch (error) {
            console.log(error.message);
            return next(ApiError.internal("Erro no rating.controller!"));
        }
    }

    async delete(req, res, next){
        try {
            const { id } = req.user;
            const { productId } = req.query;
        
            // Check if rating and productId are provided
            if (!productId) {
                return next(ApiError.badRequest(`Não todos dados foram insiridos ${productId}`))
            }
        
            const product = await Product.findByPk(productId);
        
            // Check if product exists
            if (!product) {
                return next(ApiError.notFound("O produto não foi encontrado"))
            }

            await Rating.destroy({where: {userId: id, productId}});
            
            
            const rates = await Rating.findAndCountAll({ where: { productId } });
            
            // Calculate average rating only if there are ratings
            let average = 0;
            if (rates.count > 0) {
                const sumRate = rates.rows.reduce((sum, rating) => sum + rating.rate, 0);
                average = sumRate / rates.count;
            }
        
            // Update product's rating
            await product.update({ rating: average });
        
            return res.json(product);
        } catch (error) {
            console.log(error.message);
            return next(ApiError.internal("Erro no rating.controller!"));
        }
    }


}

module.exports = new RatingController()
