const jwt = require('jsonwebtoken');


module.exports = function generateJwt(id, email, role, verified){
    return jwt.sign(
        { id, email, role, verified },
        process.env.SECRET_KEY,
        { expiresIn: '924h' }
    );
};