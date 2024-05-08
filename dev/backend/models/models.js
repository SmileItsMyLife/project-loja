const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    verified: {type: DataTypes.BOOLEAN, defaultValue: false},
    verificationToken: {type: DataTypes.STRING},
    resetPasswordToken: {type: DataTypes.STRING}
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketProduct = sequelize.define('basket_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.DOUBLE, allowNull: false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    img: {type: DataTypes.STRING, allowNull: false},
    info: {type: DataTypes.STRING}
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Rating = sequelize.define('rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.DOUBLE, allowNull: false}
})

const Comment = sequelize.define("comment", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    body: {type: DataTypes.STRING}
})

const Purchase = sequelize.define("purchase", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATE },
    value: {type: DataTypes.DOUBLE, allowNull: false},
    status: {type: DataTypes.STRING}
})

const History = sequelize.define('history', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const HistoryProduct = sequelize.define('history_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

Product.hasMany(Purchase)
Purchase.belongsTo(Product)

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasOne(History)
History.belongsTo(User)

User.hasMany(Purchase)
Purchase.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Basket.hasMany(BasketProduct)
BasketProduct.belongsTo(Basket)

History.hasMany(HistoryProduct)
HistoryProduct.belongsTo(History)

Type.hasMany(Product)
Product.belongsTo(Type)

Product.hasMany(Rating)
Rating.belongsTo(Product)

Product.hasMany(BasketProduct)
BasketProduct.belongsTo(Product)

Product.hasMany(Comment)
Comment.belongsTo(Product)

User.hasMany(Comment)
Comment.belongsTo(User)

module.exports = {
    User,
    Basket,
    History,
    HistoryProduct,
    BasketProduct,
    Product,
    Type,
    Rating,
    Comment,
    Purchase
}