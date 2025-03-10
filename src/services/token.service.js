import jwt from "jsonwebtoken";
import { storeRedisKey } from "../utils/redis.util";

const ACCESS_TOKEN_SECRET = Bun.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = Bun.env.REFRESH_TOKEN_SECRET;
const RESET_TOKEN_SECRET = Bun.env.RESET_TOKEN_SECRET;
const REFRESH_TOKEN_TTL = parseInt(Bun.env.REFRESH_TOKEN_TTL);
const ACCESS_TOKEN_TTL = parseInt(Bun.env.ACCESS_TOKEN_TTL);
const RESET_TOKEN_TTL = parseInt(Bun.env.RESET_TOKEN_TTL);

const getRemainingTTL = (decodedToken) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    return decodedToken.exp - now;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const generateToken = (payload, secretKey, ttl) => {
  try {
    const token = jwt.sign(payload, secretKey, {
      expiresIn: ttl,
    });
    return token;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        console.error(err)
        return reject(err);
      }
      resolve(decodedToken);
    });
  });
};

const generateResetPasswordToken = async (user) => {
  const payload = {
    id: user.id,
  };

  try {
    const resetPasswordToken = generateToken(
      payload,
      RESET_TOKEN_SECRET,
      RESET_TOKEN_TTL
    );
    return resetPasswordToken;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.Role.name,
  };

  try {
    const accessToken = generateToken(
      payload,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_TTL
    );
    return accessToken;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handleGenerateRefreshToken = async (user, expiryTime = REFRESH_TOKEN_TTL) => {
  const payload = {
    id: user.id,
  };

  try {
    const refreshToken = generateToken(
      payload,
      REFRESH_TOKEN_SECRET,
      expiryTime
    );
    await storeRedisKey(refreshToken, payload, expiryTime);
    return refreshToken;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const verifyResetPasswordTokenService = async (userId, resetPasswordToken) => {
  if (!resetPasswordToken) {
    throw new Error("Reset password token is required!");
  }
  try {
    const decodedResetPasswordToken = await verifyToken(
      resetPasswordToken,
      RESET_TOKEN_SECRET
    );

    if (decodedResetPasswordToken.id !== userId) {
      throw new Error("Invalid reset password token!");
    }
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Invalid reset password token!");
  }
};

export {
  getRemainingTTL,
  generateAccessToken,
  handleGenerateRefreshToken,
  generateResetPasswordToken,
  generateToken,
  verifyToken,
  verifyResetPasswordTokenService
};
