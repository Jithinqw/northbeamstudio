const { verifyAccessToken } = require("../utils/jwt");
const { User } = require("../models");

async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Authentication required"
            });
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);

        const user = await User.findOne({
            where: {
                id: payload.sub,
                status: "active"
            },
            attributes: ["id", "email", "role", "status"]
        });

        if (!user || user.role !== payload.role) {
            return res.status(401).json({
                error: "Invalid authentication"
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            error: "Invalid or expired access token"
        });
    }
}

module.exports = authenticate;