const crypto = require("crypto");

const {
    sequelize,
    User,
    Session,
    SessionRefreshToken,
    LoginAttempt,
    AuditLog
} = require("../models");

const {
    verifyPassword
} = require("../utils/password");

const {
    generateAccessToken
} = require("../utils/jwt");

const REFRESH_DAYS = Number(
    process.env.REFRESH_TOKEN_DAYS || 7
);

function hashToken(token) {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
}

function generateRefreshToken() {
    return crypto.randomBytes(48).toString("base64url");
}

function refreshExpiry() {
    return new Date(
        Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000
    );
}

async function login(email, password, req) {
    return sequelize.transaction(async (transaction) => {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            where: { email: normalizedEmail },
            transaction
        });

        const valid =
            user &&
            user.status === "active" &&
            await verifyPassword(user.password_hash, password);

        await LoginAttempt.create({
            email: normalizedEmail,
            user_id: user?.id || null,
            success: Boolean(valid),
            ip_address: req.ip,
            user_agent: req.get("user-agent")
        }, { transaction });

        if (!valid) {
            return null;
        }

        const refreshToken = generateRefreshToken();
        const expiresAt = refreshExpiry();

        const session = await Session.create({
            user_id: user.id,
            refresh_token_hash: hashToken(refreshToken),
            expires_at: expiresAt,
            ip_address: req.ip,
            user_agent: req.get("user-agent")
        }, { transaction });

        await SessionRefreshToken.create({
            session_id: session.id,
            token_hash: hashToken(refreshToken),
            expires_at: expiresAt
        }, { transaction });

        await user.update({
            last_login_at: new Date()
        }, { transaction });

        await AuditLog.create({
            user_id: user.id,
            action: "USER_LOGIN",
            resource_type: "session",
            resource_id: session.id,
            details: {},
            ip_address: req.ip
        }, { transaction });

        return {
            accessToken: generateAccessToken(user),
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    });
}

async function refresh(token, req) {
    if (!token) return null;

    const tokenHash = hashToken(token);

    return sequelize.transaction(async (transaction) => {
        const tokenRecord = await SessionRefreshToken.findOne({
            where: { token_hash: tokenHash },
            transaction
        });

        if (!tokenRecord) return null;

        const session = await Session.findByPk(
            tokenRecord.session_id,
            {
                transaction,
                lock: transaction.LOCK.UPDATE
            }
        );

        if (!session) return null;

        // Reuse of an already rotated token.
        if (tokenRecord.used_at) {
            await session.update({
                revoked_at: new Date()
            }, { transaction });

            return null;
        }

        if (
            session.revoked_at ||
            session.expires_at <= new Date() ||
            tokenRecord.expires_at <= new Date() ||
            session.refresh_token_hash !== tokenHash
        ) {
            return null;
        }

        const user = await User.findOne({
            where: {
                id: session.user_id,
                status: "active"
            },
            transaction
        });

        if (!user) {
            await session.update({
                revoked_at: new Date()
            }, { transaction });

            return null;
        }

        const newRefreshToken = generateRefreshToken();
        const newExpiresAt = refreshExpiry();

        // Mark old token as used.
        await tokenRecord.update({
            used_at: new Date()
        }, { transaction });

        // Store the new token hash.
        await SessionRefreshToken.create({
            session_id: session.id,
            token_hash: hashToken(newRefreshToken),
            expires_at: newExpiresAt
        }, { transaction });

        await session.update({
            refresh_token_hash: hashToken(newRefreshToken),
            expires_at: newExpiresAt,
            last_used_at: new Date()
        }, { transaction });

        return {
            accessToken: generateAccessToken(user),
            refreshToken: newRefreshToken
        };
    });
}

async function logout(token) {
    if (!token) return;

    const tokenHash = hashToken(token);

    await sequelize.transaction(async (transaction) => {
        const tokenRecord = await SessionRefreshToken.findOne({
            where: { token_hash: tokenHash },
            transaction
        });

        if (!tokenRecord) return;

        const session = await Session.findByPk(
            tokenRecord.session_id,
            {
                transaction,
                lock: transaction.LOCK.UPDATE
            }
        );

        if (session && !session.revoked_at) {
            await session.update({
                revoked_at: new Date()
            }, { transaction });
        }
    });
}

async function logoutAll(userId) {
    await sequelize.transaction(async (transaction) => {
        await Session.update(
            { revoked_at: new Date() },
            {
                where: {
                    user_id: userId,
                    revoked_at: null
                },
                transaction
            }
        );

        await AuditLog.create({
            user_id: userId,
            action: "USER_LOGOUT_ALL",
            details: {}
        }, { transaction });
    });
}

module.exports = {
    login,
    refresh,
    logout,
    logoutAll,
    hashToken
};