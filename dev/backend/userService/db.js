const {Sequelize} = require('sequelize')

const env = process.env.NODE_ENV || 'development';
const db_host = env == "development" ? "localhost" : process.env.DB_HOST;

module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mysql',
        host: db_host,
        port: process.env.DB_PORT,
        dialectOptions: {
            connectTimeout: 60000, // Set connection timeout to 60 seconds
        }
    }
)
