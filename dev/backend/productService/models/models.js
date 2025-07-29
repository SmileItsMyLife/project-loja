const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// User Model
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    verificationToken: { type: DataTypes.STRING, allowNull: true },
    resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
    resetPasswordTokenExpAt: { type: DataTypes.DATE, allowNull: true }
});

// Basket Model
const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

// BasketProduct Model
const BasketProduct = sequelize.define('basket_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

// Product Model
const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DOUBLE, allowNull: false },
    rating: { type: DataTypes.DOUBLE, defaultValue: 0 },
    img: { type: DataTypes.STRING, allowNull: false },
    info: { type: DataTypes.TEXT } // Changed to TEXT for larger content
});

// Type Model
const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
});

// Rating Model
const Rating = sequelize.define('rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.DOUBLE, allowNull: false }
});

// Comment Model
const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    body: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } }
});

// Message Model
const Message = sequelize.define('message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    body: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } }
});

// PurchaseBasket Model
const PurchaseBasket = sequelize.define('purchaseBasket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    totalPrice: { type: DataTypes.DOUBLE, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    addresses: { type: DataTypes.STRING, allowNull: false },
    postalCode: { type: DataTypes.STRING, allowNull: false } // Renamed for clarity
});

// PurchaseProduct Model
const PurchaseProduct = sequelize.define('purchaseProduct', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

// Relationships and Cascades
User.hasOne(Basket, { foreignKey: 'userId', onDelete: 'CASCADE' });
Basket.belongsTo(User, { foreignKey: 'userId' });

Basket.hasMany(BasketProduct, { onDelete: 'CASCADE' });
BasketProduct.belongsTo(Basket);

Product.hasMany(BasketProduct, { onDelete: 'CASCADE' });
BasketProduct.belongsTo(Product);

User.hasMany(PurchaseBasket, { onDelete: 'CASCADE' });
PurchaseBasket.belongsTo(User);

PurchaseBasket.hasMany(PurchaseProduct, { onDelete: 'CASCADE' });
PurchaseProduct.belongsTo(PurchaseBasket);

Product.hasMany(PurchaseProduct, { onDelete: 'CASCADE' });
PurchaseProduct.belongsTo(Product);

Type.hasMany(Product, { onDelete: 'CASCADE' });
Product.belongsTo(Type);

Product.hasMany(Rating, { onDelete: 'CASCADE' });
Rating.belongsTo(Product);

User.hasMany(Rating, { onDelete: 'CASCADE' });
Rating.belongsTo(User);

Product.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(Product);

User.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(User);

User.hasMany(Message, { onDelete: 'CASCADE' });
Message.belongsTo(User);

module.exports = {
    User,
    Basket,
    BasketProduct,
    Product,
    Type,
    Rating,
    Comment,
    Message,
    PurchaseBasket,
    PurchaseProduct
};