const router = require("express").Router();
const rateLimit = require("express-rate-limit");

const controller = require("../controllers/auth.controller");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");

const { loginSchema } = require("../validators/auth.validator");

// Login rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        error: "Too many login attempts. Try again later."
    }
});

// Refresh rate limiter
const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false
});

// POST /api/auth/login
router.post(
    "/login",
    loginLimiter,
    validate(loginSchema),
    controller.login
);

// POST /api/auth/refresh
router.post(
    "/refresh",
    refreshLimiter,
    controller.refresh
);

// POST /api/auth/logout
router.post(
    "/logout",
    controller.logout
);

// POST /api/auth/logout-all
router.post(
    "/logout-all",
    authenticate,
    controller.logoutAll
);

// GET /api/auth/me
router.get(
    "/me",
    authenticate,
    controller.me
);

module.exports = router;