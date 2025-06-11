const { Product } = require('../models/models');
const ApiError = require('../../main/error/ApiError');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const updateProduct = async (req, res, next) => {
    try {
        const { id, name, price, info, typeId } = req.body;

        // Find the product by ID
        const product = await Product.findOne({ where: { id } });

        // Check if the product exists
        if (!product) {
            return next(ApiError.notFound(`O produto com o ID ${id} não foi encontrado`));
        }

        let fileName;
        if (req.files && req.files.img) {
            // Generate a unique file name for the new image
            fileName = uuid.v4() + ".jpg";

            // Get the path of the current image
            const currentFilePath = path.resolve(__dirname, '..', 'static', product.img);

            // Delete the current image if it exists
            if (fs.existsSync(currentFilePath)) {
                fs.unlinkSync(currentFilePath);
            }

            // Move the new image to the static folder
            const newFilePath = path.resolve(__dirname, '..', 'static', fileName);
            await req.files.img.mv(newFilePath);
        }

        // Prepare the fields to update
        const updateData = { name, price, info, typeId };

        // If a new image was provided, update the image field
        if (fileName) {
            updateData.img = fileName;
        }

        // Update the product with the new data
        await product.update(updateData);

        // Delete unused files in the static folder
        deleteUnusedFiles();

        // Return a success response
        return res.status(200).json({ message: "Produto foi atualizado com sucesso!" });
    } catch (error) {
        console.error(error.message);
        return next(ApiError.internal("Erro na atualização do produto"));
    }
};

// Helper function to delete unused files
const deleteUnusedFiles = () => {
    const staticFolder = path.resolve(__dirname, '..', 'static');

    fs.readdir(staticFolder, async (err, files) => {
        if (err) {
            console.error(`Erro ao ler a pasta estática: ${err.message}`);
            return;
        }

        for (const file of files) {
            const filePath = path.join(staticFolder, file);

            try {
                // Check if the file is used by any product
                const isFileUsed = await Product.findOne({ where: { img: file } });

                // If the file is not used, delete it
                if (!isFileUsed) {
                    fs.unlinkSync(filePath);
                    console.log(`Arquivo não utilizado excluído: ${file}`);
                }
            } catch (error) {
                console.error(`Erro ao verificar ou excluir o arquivo: ${error.message}`);
            }
        }
    });
};

module.exports = updateProduct;