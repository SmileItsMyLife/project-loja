const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

module.exports = function(role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1] // Bearer asfasnfkajsfnjk
            if (!token) {
                return res.status(401).json({message: "Não autorizado"})
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            const user = User.findOne({ where: { id: decoded.id, email: decoded.email } });
            if (user.role !== role) {
                return res.status(403).json({message: "Não tem permissão"})
            }
            req.user = decoded;
            next()
        } catch (e) {
            res.status(401).json({message: "Não autorizado"})
        }
    };
}



