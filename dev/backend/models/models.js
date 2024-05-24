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

const Message = sequelize.define("message", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    body: {type: DataTypes.STRING}
})

const PurchaseBasket = sequelize.define("purchaseBasket", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATE, allowNull: true },
    totalPrice: {type: DataTypes.DOUBLE, allowNull: true},
    status: {type: DataTypes.STRING, allowNull: true}
})

const PurchaseProduct = sequelize.define("purchaseProduct", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

User.hasMany(Message)
Message.belongsTo(User)

Product.hasMany(PurchaseProduct)
PurchaseProduct.belongsTo(Product)

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(PurchaseBasket)
PurchaseBasket.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Basket.hasMany(BasketProduct)
BasketProduct.belongsTo(Basket)

PurchaseBasket.hasMany(PurchaseProduct)
PurchaseProduct.belongsTo(PurchaseBasket)

Type.hasMany(Product)
Product.belongsTo(Type)

Product.hasMany(Rating)
Rating.belongsTo(Product)

Product.hasMany(BasketProduct)
BasketProduct.belongsTo(Product)

Product.hasMany(PurchaseProduct)
PurchaseProduct.belongsTo(Product)

Product.hasMany(Comment)
Comment.belongsTo(Product)

User.hasMany(Comment)
Comment.belongsTo(User)

module.exports = {
    User,
    Basket,
    PurchaseProduct,
    BasketProduct,
    Product,
    Type,
    Rating,
    Comment,
    PurchaseBasket
}