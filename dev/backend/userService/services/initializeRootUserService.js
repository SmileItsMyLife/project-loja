const { User, Basket } = require("../models/models");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");

const initializeRootUser = async (req, res) => {

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
            return await Basket.create({ userId: new_root.id });
        }

        const root_basket = await Basket.findOne({ where: { userId: root.id } });
        
        if (!root_basket) {
            return await Basket.create({ userId: root.id });
        }

    } catch (error) {
        return console.error("Error initializing root user:", error.message);
    
    }
}

module.exports = initializeRootUser;