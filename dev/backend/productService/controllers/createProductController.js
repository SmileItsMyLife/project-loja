const uuid = require('uuid');
const path = require('path');
const { Product } = require('../models/models');
const ApiError = require('../error/ApiError');
const fs = require('fs');

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

        const product = await Product.create({ name, price, typeId, img: fileName, info });
        
        return res.status(200).json({ product });
    } catch (error) {
        console.error(error.message);
        return next(ApiError.internal("Erro durante o registro do produto"));
    }
};

module.exports = createProduct;