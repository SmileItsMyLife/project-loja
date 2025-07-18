const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError'); // Assuming you have a centralized error handler
const { User } = require('../models/models');

module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.error("Authorization header missing");
            return next(ApiError.unAutorized("Não autorizado: Cabeçalho de autorização ausente."));
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.error("Token missing in authorization header");
            return next(ApiError.unAutorized("Não autorizado: Token ausente."));
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({ where: { id: decoded.id, email: decoded.email } });
        if (!user) {
            console.error("User not found");
            return next(ApiError.unAutorized("Não autorizado: Usuário não encontrado."));
        } else {
            req.user = decoded;
            return next();
        }
    } catch (error) {
        console.error("Error verifying token:", error.message);
        return next(ApiError.unAutorized("Não autorizado: " + error.message));
    }
};
