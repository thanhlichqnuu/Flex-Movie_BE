import Users from "../models/users.model";
import Roles from "../models/roles.model";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { getRedisValue, deleteRedisKey } from "../utils/redis.util";
import { generateAccessToken, handleGenerateRefreshToken, verifyToken, getRemainingTTL } from "./token.service";
import { sendVerificationEmailService } from "./mail.service";

const REFRESH_TOKEN_SECRET = Bun.env.REFRESH_TOKEN_SECRET;

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

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      throw new Error("Incorrect email or password!");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await handleGenerateRefreshToken(user);

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

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      throw new Error("Incorrect email or password!");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await handleGenerateRefreshToken(user);

    return { accessToken, refreshToken };
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
    const storedOldRefreshToken = await getRedisValue(oldRefreshToken);
    if (!storedOldRefreshToken) {
      throw new Error("Invalid refresh token!");
    }

    let decodedRefreshToken;
    try {
      decodedRefreshToken = await verifyToken(oldRefreshToken, REFRESH_TOKEN_SECRET);
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

    await deleteRedisKey(oldRefreshToken);

    const remainingRefreshTokenTTL = getRemainingTTL(decodedRefreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = await handleGenerateRefreshToken(user, remainingRefreshTokenTTL);

    return { newAccessToken, newRefreshToken };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const logoutService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required!");
  }

  try {
    const storedRefreshToken = await getRedisValue(refreshToken);
    if (!storedRefreshToken) {
      throw new Error("Invalid refresh token!");
    }

    try {
      await verifyToken(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (err) {
      throw new Error("Invalid refresh token!");
    }

    await deleteRedisKey(refreshToken);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const initiateRegistrationService = async (userData) => {
  const { name, email, password } = userData;

  try {
    const existedUser = await Users.findOne({
      where: { email },
    });
    
    if (existedUser) {
      throw new Error("Email already exists!");
    }
    
    await sendVerificationEmailService(name, email, password);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const verifyOTPService = async (email, otpCode) => {
  try {
    const storedUserData = await getRedisValue(`registration:${email}`);
    
    if (!storedUserData) {
      throw new Error("OTP expired!");
    }

    const payload = JSON.parse(storedUserData);
    
    if (payload.otpCode !== otpCode) {
      throw new Error("Invalid OTP!");
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(payload.password, salt);
    
    await Users.create({ 
      name: payload.name, 
      email: payload.email, 
      password: hashPassword,
    });
    
    await deleteRedisKey(`registration:${email}`);
    
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export {
  loginUserService,
  loginAdminService,
  refreshAccessToken,
  logoutService,
  initiateRegistrationService,
  verifyOTPService
};
