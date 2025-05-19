const {Type} = require('../models/models');
const ApiError = require('../error/ApiError');

class TypeController {
    async create(req, res, next) {
        try {
            const {name} = req.body;
            // Check if the name is provided
            if (!name) {
                throw ApiError.badRequest('Name is required.');
            }
            const type = await Type.create({name});
            return res.json(type);
        } catch (error) {
            next(error); // Pass the error to the error handling middleware
        }
    }

    async getAll(req, res, next) {
        try {
            const types = await Type.findAll();
            return res.json(types);
        } catch (error) {
            next(error); // Pass the error to the error handling middleware
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.query;
            // Check if the id is provided
            if (!id) {
                throw ApiError.badRequest('ID is required.');
            }
            await Type.destroy({where: {id}});
            return res.json({message: "Deleted"});
        } catch (error) {
            next(error); // Pass the error to the error handling middleware
        }
    }
}

module.exports = new TypeController();