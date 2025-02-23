import Users from "../models/users.model";
import Roles from "../models/roles.model";
import { connectRedis, redisClient } from "../config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const ACCESS_TOKEN_SECRET = Bun.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = Bun.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_TTL = parseInt(Bun.env.REFRESH_TOKEN_TTL);
const ACCESS_TOKEN_TTL = parseInt(Bun.env.ACCESS_TOKEN_TTL);

const getRefreshToken = async (refreshToken) => {
  try {
    if (!redisClient.isReady) {
      await connectRedis();
    }
    return redisClient.get(refreshToken);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const storeRefreshToken = async (refreshToken, payload, ttl) => {
  try {
    if (!redisClient.isReady) {
      await connectRedis();
    }
    redisClient.set(refreshToken, JSON.stringify(payload), { EX: ttl });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const deleteRefreshToken = async (refreshToken) => {
  try {
    if (!redisClient.isReady) {
      await connectRedis();
    }
    redisClient.del(refreshToken);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getRemainingTTL = (decodedToken) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    return decodedToken.exp - now;
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
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL,
    });
    return accessToken;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const generateRefreshToken = async (user, expiryTime = REFRESH_TOKEN_TTL) => {
  const payload = {
    id: user.id,
  };
  try {
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: expiryTime,
    });
    await storeRefreshToken(refreshToken, payload, expiryTime);
    return refreshToken;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const refreshAccessToken = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    throw new Error("Refresh token is required!");
  }

  try {
    const storedOldRefreshToken = await getRefreshToken(oldRefreshToken);
    if (!storedOldRefreshToken) {
      throw new Error("Invalid refresh token!");
    }

    let decoded
    try {
      decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);
    } catch (err) {
      throw new Error("Invalid refresh token!");
    }

    const payload = JSON.parse(storedOldRefreshToken);

    const user = await Users.findOne({
      where: {
        id: payload.id,
      },
      include: [Roles],
    });

    if (!user) {
      throw new Error("User not found!");
    }

    await deleteRefreshToken(oldRefreshToken);

    const remainingTTL = getRemainingTTL(decoded);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user, remainingTTL);

    return { newAccessToken, newRefreshToken };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const registerUserService = async (userData) => {
  const { email, name, password } = userData;

  try {
    const existedUser = await Users.findOne({
      where: { email },
      include: [Roles],
    });
    if (existedUser) {
      throw new Error("Email is already exists!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await Users.create({ email, name, password: hashPassword });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const loginUserService = async (userData) => {
  const { email, password } = userData;
  try {
    const user = await Users.findOne({
      where: {
        email,
        role_id: {
          [Op.ne]: 1,
        },
      },
      include: [Roles],
    });

    if (!user) {
      throw new Error("Incorrect email or password!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Incorrect email or password!");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return { accessToken, refreshToken };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const loginAdminService = async (userData) => {
  const { email, password } = userData;

  try {
    const user = await Users.findOne({
      where: {
        email,
        role_id: {
          [Op.notIn]: [2, 3],
        },
      },
      include: [Roles],
    });

    if (!user) {
      throw new Error("Incorrect email or password!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Incorrect email or password!");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return { accessToken, refreshToken };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const logoutService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is missing!");
  }
  try {
    await deleteRefreshToken(refreshToken);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export {
  registerUserService,
  loginUserService,
  loginAdminService,
  refreshAccessToken,
  logoutService,
};
