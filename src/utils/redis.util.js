import { connectRedis, redisClient } from "../config/redis.config";

const getRedisValue = async (key) => {
  try {
    if (!redisClient.isReady) {
      await connectRedis();
    }
    return redisClient.get(key);
  } catch (err) {
    throw err
  }
};

const storeRedisKey = async (key, value, ttl) => {
  try {
    if (!redisClient.isReady) {
      await connectRedis();
    }
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  } catch (err) {
    throw err
  }
};

const deleteRedisKey = async (key) => {
  try {
    if (!redisClient.isReady) {
      await connectRedis();
    }
    await redisClient.del(key);
  } catch (err) {
    throw err
  }
};

export { getRedisValue, storeRedisKey, deleteRedisKey };