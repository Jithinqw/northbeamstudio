const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m",
            issuer: "markdown-platform",
            audience: "markdown-platform-api",
            algorithm: "HS256"
        }
    );
}

function verifyAccessToken(token) {
    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET,
        {
            issuer: "markdown-platform",
            audience: "markdown-platform-api",
            algorithms: ["HS256"]
        }
    );
}

module.exports = {
    generateAccessToken,
    verifyAccessToken
};