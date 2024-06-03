const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
const { Product, BasketProduct } = require('../models/models')
const ApiError = require('../error/ApiError');

class ProductController {
    async create(req, res, next) {
        try {
            // Extrai dados do corpo da requisição
            const { name, price, typeId, info } = req.body;

            // Verifica se todos os campos necessários estão presentes
            if (!name || !price || !typeId || !info) {
                return next(ApiError.badRequest("Todos os dados devem ser fornecidos"));
            }

            // Verifica se a imagem está presente nos arquivos da requisição
            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest("A imagem não foi fornecida"));
            }

            // Gera um nome único para o arquivo da imagem
            const fileName = uuid.v4() + ".jpg";

            // Move o arquivo da imagem para a pasta estática
            const imagePath = path.resolve(__dirname, '..', 'static', fileName);
            await req.files.img.mv(imagePath);

            // Cria o produto no banco de dados
            const product = await Product.create({ name, price, typeId, img: fileName, info });

            // Retorna o produto criado
            return res.status(200).json({ product });
        } catch (error) {
            console.error(error.message);

            // Se ocorrer um erro, envie uma resposta de erro interno
            return next(ApiError.internal("Erro durante o registro do produto"));
        }
    }

    async getAll(req, res, next) {
        try {
            // Extrai parâmetros da consulta (query)
            let { typeId, limit, page } = req.query;

            // Defina valores padrão para limit e page, caso não sejam fornecidos na consulta
            page = page || 1;
            limit = limit || 2;

            // Converta os valores de limit e page para números inteiros
            page = parseInt(page);
            limit = parseInt(limit);

            // Calcule o offset com base na página atual e no limite por página
            let offset = page * limit - limit;

            let products;

            // Verifica se typeId foi fornecido
            if (!typeId || typeId == 0) {
                // Se typeId não estiver presente, encontre todos os produtos com limite e offset
                products = await Product.findAndCountAll({ limit, offset });
            } else {
                // Se typeId estiver presente, encontre produtos com esse typeId, com limite e offset
                products = await Product.findAndCountAll({ where: { typeId }, limit, offset });
            }

            const allProducts = await Product.findAll()

            const totalPages = Math.ceil(allProducts.length / limit);


            // Retorna os produtos encontrados
            return res.status(200).json({products, totalPages});
        } catch (error) {
            console.log(error.message)
            return next(ApiError.internal("Erro ao buscar produtos"));
        }
    }

    async getOne(req, res, next) {
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

            await BasketProduct.destroy({where: {productId: product.id}})

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
}

module.exports = new ProductController()