const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const routes = require("./routes");

const app = express();

app.disable("x-powered-by");

// Security
app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json({
    limit: "1mb"
}));

app.use(express.urlencoded({
    extended: false,
    limit: "1mb"
}));

app.use(cookieParser());

// General API rate limiting
app.use("/api", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false
}));

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use("/api", routes);

// 404
app.use((req, res) => {
    res.status(404).json({
        error: "Resource not found"
    });
});

// Central error handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const status = err.statusCode || 500;

    if (status >= 500) {
        req.log?.error({ err }, "Request failed");
    }

    res.status(status).json({
        success: false,
        error: status >= 500
            ? "Internal server error"
            : err.message
    });
});

module.exports = app;