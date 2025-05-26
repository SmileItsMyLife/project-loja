const generateJwt = require('../services/jwtService');
const ApiError = require('../error/ApiError');

module.exports = function check(req, res, next) {
    try {
        const user = req.user;
        const token = generateJwt(user.id, user.email, user.role, user.verified);
        return res.json({ token });
    } catch (error) {
        return next(ApiError.internal("Erro ao verificar token."));
    }
};
