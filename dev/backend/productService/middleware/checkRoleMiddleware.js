const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

module.exports = function (role) {
    return async function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1] // Bearer asfasnfkajsfnjk
            if (!token) {
                return res.status(401).json({ message: "Não autorizado" })
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            const user = await User.findOne({
                where: {
                    id: decoded.id
                }
            });
            if (!user) {
                return res.status(401).json({ message: "Utilizador não encontrado" })
            }
            if (user.role !== role) {
                return res.status(403).json({ decoded, user });
            }
            req.user = decoded;
            next()
        } catch (e) {
            res.status(401).json({ message: "Não autorizado" })
        }
    };
}



