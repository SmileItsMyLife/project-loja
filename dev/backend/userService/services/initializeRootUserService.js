const { User, Basket } = require("../models/models");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");

const initializeRootUser = async (req, res, next) => {

    try {

        const root = await User.findOne({ where: { email: "root@admin.com" } });
        
        if (!root) {
            const root_password = process.env.ROOT_PASSWORD || "root";
            const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');
            const new_root = await User.create({
                email: "root@admin.com",
                password: await bcrypt.hash(root_password, SALT_ROUNDS),
                verified: true,
                role: "ADMIN"
            })
            await Basket.create({ userId: new_root.id });
            return next(res.status(200).json());
        }

        const root_basket = await Basket.findOne({ where: { userId: root.id } });
        
        if (!root_basket) {
            await Basket.create({ userId: root.id });
            return next(res.status(200).json());
        }

    } catch (error) {

        console.error("Error initializing root user:", error.message);
        return next(ApiError.internal("Erro ao inicializar o usuário root"));
    
    }
}

module.exports = initializeRootUser;