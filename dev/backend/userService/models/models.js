const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true // Ensures the email is valid
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 100] // Ensures the password is at least 8 characters long
        }
    },
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    verified: {type: DataTypes.BOOLEAN, defaultValue: false},
    verificationToken: {type: DataTypes.STRING, allowNull: true},
    resetPasswordToken: {type: DataTypes.STRING, allowNull: true},
    resetPasswordTokenExpAt: {type: DataTypes.DATE, allowNull: true}
})


const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER, allowNull: false}
})

module.exports = {
    User,
    Basket
}