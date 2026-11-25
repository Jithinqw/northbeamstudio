require("dotenv").config();

const app = require("../app");
const { sequelize } = require("../models");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log("PostgreSQL connected");

        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        async function shutdown(signal) {
            console.log(`${signal} received`);

            server.close(async () => {
                await sequelize.close();
                process.exit(0);
            });

            setTimeout(() => process.exit(1), 10000)
                .unref();
        }

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));

    } catch (error) {
        console.error("Application startup failed", error);
        process.exit(1);
    }
}

startServer();