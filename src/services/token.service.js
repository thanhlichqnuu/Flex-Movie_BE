import jwt from "jsonwebtoken";
import { storeRedisKey } from "../utils/redis.util";
import { getSubscriptionByUserIdService } from "./subscriptions.service";

const ACCESS_TOKEN_SECRET = Bun.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = Bun.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_TTL = parseInt(Bun.env.REFRESH_TOKEN_TTL);
const ACCESS_TOKEN_TTL = parseInt(Bun.env.ACCESS_TOKEN_TTL);

const getRemainingTTLService = (decodedToken) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    return decodedToken.exp - now;
  } catch (err) {
    throw err;
  }
};

const generateTokenService = (payload, secretKey, ttl) => {
  try {
    const token = jwt.sign(payload, secretKey, {
      expiresIn: ttl,
    });
    return token;
  } catch (err) {
    throw err;
  }
};

const verifyTokenService = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        return reject(err);
      }
      resolve(decodedToken);
    });
  });
};

const generateAccessTokenService = async (user) => {
  const currentSubscription = await getSubscriptionByUserIdService(user.id);

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.Role.name,
    subscription: currentSubscription ? currentSubscription.plan : null,
  };

  try {
    const accessToken = generateTokenService(
      payload,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_TTL
    );
   
    return accessToken;
  } catch (err) {
    throw err;
  }
};

const handleGenerateRefreshTokenService = async (user, expiryTime = REFRESH_TOKEN_TTL) => {
  const payload = {
    id: user.id,
  };

  try {
    const refreshToken = generateTokenService(
      payload,
      REFRESH_TOKEN_SECRET,
      expiryTime
    );
    await storeRedisKey(refreshToken, payload, expiryTime);
    return refreshToken;
  } catch (err) {
    throw err;
  }
};

export {
  getRemainingTTLService,
  generateAccessTokenService,
  handleGenerateRefreshTokenService,
  generateTokenService,
  verifyTokenService,
};
