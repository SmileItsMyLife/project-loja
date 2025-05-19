const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1] // Bearer asfasnfkajsfnjk
        if (!token) {
            console.log("Error 01")
            return res.status(401).json({message: "Não autorizado (1)"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (e) {
        console.log(e.message)
        return res.status(401).json({message: "Não autorizado (2) " + e.message})
    }
};
