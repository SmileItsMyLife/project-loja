const uuid = require('uuid');
const path = require('path');
const { Product } = require('../models/models');
const ApiError = require('../error/ApiError');
const fs = require('fs');
const { clearRedisProducts } = require('../utils/clearRedisProducts');

const createProduct = async (req, res, next) => {
    try {
        const { name, price, typeId, info } = req.body;

        if (!name || !price || !typeId || !info) {
            return next(ApiError.badRequest("Todos os dados devem ser fornecidos"));
        }

        if (!req.files || !req.files.img) {
            return next(ApiError.badRequest("A imagem não foi fornecida"));
        }

        const fileName = uuid.v4() + ".jpg";
        const staticDir = path.resolve(__dirname, '..', 'static');
        const imagePath = path.join(staticDir, fileName);

        if (!fs.existsSync(staticDir)) {
            fs.mkdirSync(staticDir, { recursive: true });
        }

        await req.files.img.mv(imagePath);

        const parsedPrice = parseFloat(price);
        const parsedTypeId = parseInt(typeId, 10);

        if (isNaN(parsedPrice) || isNaN(parsedTypeId)) {
            return next(ApiError.badRequest("Preço e tipo devem ser números válidos"));
        }

        console.log({ name, info, price, typeId, img: fileName });

        const product = await Product.create({
            name,
            info,
            img: fileName,
            price: parsedPrice,
            typeId: parsedTypeId
        });

        console.log({ name, info, price, typeId, img: fileName });


        await clearRedisProducts();

        return res.status(200).json({ product });
    } catch (error) {
        console.error('CREATE PRODUCT ERROR:', error);
        return next(ApiError.internal("Erro durante o registro do produto"));
    }
};

module.exports = createProduct;