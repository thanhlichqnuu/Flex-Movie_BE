import { Sequelize } from "sequelize";
import { createClient } from "redis";

const DB_NAME = Bun.env.DB_NAME;
const DB_USER = Bun.env.DB_USER;
const DB_PASSWORD = Bun.env.DB_PASSWORD;
const DB_HOST = Bun.env.DB_HOST;
const DB_DIALECT = Bun.env.DB_DIALECT;
const REDIS_CLOUD_HOST = Bun.env.REDIS_CLOUD_HOST
const REDIS_CLOUD_PORT = Bun.env.REDIS_CLOUD_PORT
const REDIS_CLOUD_USERNAME = Bun.env.REDIS_CLOUD_USERNAME
const REDIS_CLOUD_PASSWORD = Bun.env.REDIS_CLOUD_PASSWORD

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT
});

const redisClient = createClient({
    username: REDIS_CLOUD_USERNAME,
    password: REDIS_CLOUD_PASSWORD,
    socket: {
        host: REDIS_CLOUD_HOST,
        port: REDIS_CLOUD_PORT
    }
});
redisClient.on("error", (err) => {
    console.error("Redis client error:", err);
})

const connectMySQL = async () => {
    try {
        await sequelize.authenticate();
        console.log("MySQL connection has been established successfully!");
    }
    catch (err) {
        console.error("Failed to connect to MySQL:", err);
    }
}

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis client connected successfully!");
    }
    catch (err) {
        console.error("Failed to connect to Redis:", err);
    }
}

export { sequelize, connectMySQL, connectRedis, redisClient };
