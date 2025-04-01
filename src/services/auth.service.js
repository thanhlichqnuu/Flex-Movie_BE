import Users from "../models/users.model";
import Roles from "../models/roles.model";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { getRedisValue, deleteRedisKey } from "../utils/redis.util";
import {
  generateAccessTokenService,
  handleGenerateRefreshTokenService,
  verifyTokenService,
  getRemainingTTLService,
} from "./token.service";
import {
  sendMailResetPasswordService,
  sendVerificationEmailService,
} from "./mail.service";

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

    const accessToken = generateAccessTokenService(user);
    const refreshToken = await handleGenerateRefreshTokenService(user);

    return { accessToken, refreshToken };
  } catch (err) {
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

    const accessToken = generateAccessTokenService(user);
    const refreshToken = await handleGenerateRefreshTokenService(user);

    return { accessToken, refreshToken };
  } catch (err) {
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
      decodedRefreshToken = await verifyTokenService(
        oldRefreshToken,
        REFRESH_TOKEN_SECRET
      );
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

    const remainingRefreshTokenTTL =
      getRemainingTTLService(decodedRefreshToken);

    const newAccessToken = generateAccessTokenService(user);
    const newRefreshToken = await handleGenerateRefreshTokenService(
      user,
      remainingRefreshTokenTTL
    );

    return { newAccessToken, newRefreshToken };
  } catch (err) {
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
      await verifyTokenService(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (err) {
      throw new Error("Invalid refresh token!");
    }

    await deleteRedisKey(refreshToken);
  } catch (err) {
    throw err;
  }
};

const initiateResetPasswordService = async (email) => {
  try {
    const existedUser = await Users.findOne({
      where: { email },
    });

    if (!existedUser) {
      throw new Error("User not found!");
    }

    await sendMailResetPasswordService(email);
  } catch (err) {
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
    throw err;
  }
};

const verifyOTPService = async (email, otpCode, keyRedis) => {
  try {
    const storedUserData = await getRedisValue(`${keyRedis}:${email}`);

    if (!storedUserData) {
      throw new Error("Invalid OTP!");
    }

    const payload = JSON.parse(storedUserData);

    if (payload.otpCode !== otpCode) {
      throw new Error("Invalid OTP!");
    }

    await deleteRedisKey(`${keyRedis}:${email}`);

    return payload;
  } catch (err) {
    throw err;
  }
};

export {
  loginUserService,
  loginAdminService,
  refreshAccessToken,
  logoutService,
  initiateResetPasswordService,
  initiateRegistrationService,
  verifyOTPService,
};
