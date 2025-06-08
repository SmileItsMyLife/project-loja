const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
const { Product, BasketProduct } = require('../models/models')
const ApiError = require('../error/ApiError');
const { Op, Sequelize } = require('sequelize')

class ProductController {

    

    async update(req, res, next) {
        try {
            const { id, name, price, info, typeId } = req.body;

            // Encontra o produto pelo ID
            const product = await Product.findOne({ where: { id } });

            // Verifica se o produto foi encontrado
            if (!product) {
                // Se não encontrou o produto, retorna um erro 404
                return next(ApiError.notFound(`O produto com o ID ${id} não foi encontrado`));
            }

            let fileName;
            if (req.files && req.files.img) {
                // Se uma nova imagem for fornecida, mova-a para a pasta estática

                // Gera um novo nome de arquivo único para a nova imagem
                fileName = uuid.v4() + ".jpg";

                // Obtém o caminho do arquivo atual
                const filePath = path.resolve(__dirname, '..', 'static', product.img);

                // Exclui o arquivo atual
                fs.unlinkSync(filePath);

                // Move a nova imagem para a pasta estática
                await req.files.img.mv(path.resolve(__dirname, '..', 'static', fileName));
            }

            // Define os campos a serem atualizados no produto
            const updateData = { name, price, info, typeId };

            // Se uma nova imagem foi fornecida, atualize o campo de imagem
            if (fileName) {
                updateData.img = fileName;
            }

            // Atualiza o produto com os novos dados
            await product.update(updateData);

            // Retorna uma resposta de sucesso
            return res.status(200).json({ message: "Produto foi atualizado com sucesso!" });
        } catch (error) {
            // Se ocorrer um erro, registra o erro e retorna um erro interno
            console.log(error.message);
            return next(ApiError.internal("Erro na atualização do produto"));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params; // Extrai o ID do parâmetro da solicitação

            // Verifica se o ID foi fornecido
            if (!id) {
                return next(ApiError.badRequest("O ID não foi indicado"));
            }

            // Encontra o produto pelo ID
            const product = await Product.findByPk(id);

            // Verifica se o produto foi encontrado
            if (!product) {
                return next(ApiError.notFound(`O produto com ID: ${id} não foi encontrado`));
            }

            await BasketProduct.destroy({ where: { productId: product.id } })

            const filePath = path.resolve(__dirname, '..', 'static', product.img);

            // Exclui o arquivo atual
            fs.unlinkSync(filePath);

            // Remove o produto do banco de dados
            await product.destroy();

            // Retorna uma mensagem de sucesso
            return res.status(200).json({ message: "Produto apagado com sucesso" });
        } catch (error) {
            // Se ocorrer um erro, registra o erro e retorna um erro interno
            console.log(error.message);
            return next(ApiError.internal("Erro ao excluir o produto"));
        }
    }

    async recommends(req, res, next) {
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

}

module.exports = new ProductController()