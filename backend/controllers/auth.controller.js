const authService = require("../services/auth.service");

const COOKIE_NAME = "refresh_token";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/auth"
};

function setRefreshCookie(res, token) {
    res.cookie(COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: Number(
            process.env.REFRESH_TOKEN_DAYS || 7
        ) * 24 * 60 * 60 * 1000
    });
}

function clearRefreshCookie(res) {
    res.clearCookie(COOKIE_NAME, cookieOptions);
}

// POST /api/auth/login
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const result = await authService.login(
            email,
            password,
            req
        );

        if (!result) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password"
            });
        }

        setRefreshCookie(res, result.refreshToken);

        return res.status(200).json({
            success: true,
            accessToken: result.accessToken,
            user: result.user
        });

    } catch (error) {
        next(error);
    }
}

// POST /api/auth/refresh
async function refresh(req, res, next) {
    try {
        const token = req.cookies?.[COOKIE_NAME];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Refresh token required"
            });
        }

        const result = await authService.refresh(token, req);

        if (!result) {
            clearRefreshCookie(res);

            return res.status(401).json({
                success: false,
                error: "Session expired or invalid"
            });
        }

        setRefreshCookie(res, result.refreshToken);

        return res.json({
            success: true,
            accessToken: result.accessToken
        });

    } catch (error) {
        next(error);
    }
}

// POST /api/auth/logout
async function logout(req, res, next) {
    try {
        const token = req.cookies?.[COOKIE_NAME];

        await authService.logout(token);

        clearRefreshCookie(res);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        next(error);
    }
}

// POST /api/auth/logout-all
async function logoutAll(req, res, next) {
    try {
        await authService.logoutAll(req.user.id);

        clearRefreshCookie(res);

        return res.status(200).json({
            success: true,
            message: "All sessions revoked"
        });

    } catch (error) {
        next(error);
    }
}

// GET /api/auth/me
async function me(req, res) {
    return res.json({
        success: true,
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    });
}

module.exports = {
    login,
    refresh,
    logout,
    logoutAll,
    me
};