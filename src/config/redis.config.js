import { createClient } from "@redis/client";

const REDIS_CLOUD_HOST = Bun.env.REDIS_CLOUD_HOST
const REDIS_CLOUD_PORT = Bun.env.REDIS_CLOUD_PORT
const REDIS_CLOUD_USERNAME = Bun.env.REDIS_CLOUD_USERNAME
const REDIS_CLOUD_PASSWORD = Bun.env.REDIS_CLOUD_PASSWORD

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

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis client connected successfully!");
    }
    catch (err) {
        console.error("Failed to connect to Redis:", err);
        throw err
    }
}

export { connectRedis, redisClient };