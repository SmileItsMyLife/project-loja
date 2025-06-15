const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError'); // Assuming you have a centralized error handler

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.error("Authorization header missing");
            return next(ApiError.unAuthorized("Não autorizado: Cabeçalho de autorização ausente."));
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.error("Token missing in authorization header");
            return next(ApiError.unAuthorized("Não autorizado: Token ausente."));
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        return next();
    } catch (error) {
        console.error("Error verifying token:", error.message);
        return next(ApiError.unAuthorized("Não autorizado: " + error.message));
    }
};
