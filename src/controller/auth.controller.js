import {
  loginUserService,
  loginAdminService,
  refreshAccessToken,
  logoutService,
  initiateRegistrationService,
  verifyOTPService,
} from "../services/auth.service";

import {
  sendMailResetPasswordService,
} from "../services/mail.service";

import { verifyResetPasswordTokenService } from "../services/token.service";
import { resetPasswordService } from "../services/users.service";

const REFRESH_TOKEN_TTL = parseInt(Bun.env.REFRESH_TOKEN_TTL);

const loginUserController = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await loginUserService(req.body);
    const isMobile = req.headers['x-client-type'] === 'mobile';

    if (isMobile) {
      return res.status(200).json({
        statusCode: 200,
        isSuccess: true,
        result: { accessToken: accessToken, refreshToken: refreshToken },
      });
    } else {
      const cookieOptions = {
        httpOnly: true,
        secure: false, 
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_TTL * 1000,
        path: '/',
      };
      await res.cookie('refreshToken', refreshToken, cookieOptions);

      return res.status(200).json({
        statusCode: 200,
        isSuccess: true,
        result: { accessToken: accessToken },
      });
    }
  } catch (err) {
    if (err.message === 'Incorrect email or password!') {
      return res.status(401).json({
        statusCode: 401,
        isSuccess: false,
        error: 'Unauthorized',
        message: err.message,
      });
    }
    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred. Please try again later!',
    });
  }
};

const loginAdminController = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await loginAdminService(req.body);
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_TTL * 1000,
      path: "/",
    };
    await res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: { accessToken: accessToken },
    });
  } catch (err) {
    if (err.message === "Incorrect email or password!") {
      return res.status(401).json({
        statusCode: 401,
        isSuccess: false,
        error: "Unauthorized",
        message: err.message,
      });
    }
    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
};

const refreshTokenController = async (req, res) => {
  try {
    const isMobile = req.headers['x-client-type'] === 'mobile';
    let refreshToken;
    if (isMobile) {
      refreshToken = req.body.refreshToken; 
    } else {
      refreshToken = req.cookies.refreshToken; 
    }

    const { newAccessToken, newRefreshToken } = await refreshAccessToken(refreshToken);

    if (isMobile) {
      return res.status(200).json({
        statusCode: 200,
        isSuccess: true,
        result: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      });
    } else {
      const cookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_TTL * 1000,
        path: '/',
      };
      await res.cookie('refreshToken', newRefreshToken, cookieOptions);

      return res.status(200).json({
        statusCode: 200,
        isSuccess: true,
        result: { accessToken: newAccessToken },
      });
    }
  } catch (err) {
    if (err.message === 'Refresh token is required!') {
      return res.status(400).json({
        statusCode: 400,
        isSuccess: false,
        error: 'Bad Request',
        message: err.message,
      });
    }
    if (err.message === 'Invalid refresh token!') {
      return res.status(401).json({
        statusCode: 401,
        isSuccess: false,
        error: 'Unauthorized',
        message: err.message,
      });
    }

    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred. Please try again later!',
    });
  }
};

const logoutController = async (req, res) => {
  try {
    const isMobile = req.headers['x-client-type'] === 'mobile';
    let refreshToken;

    if (isMobile) {
      refreshToken = req.body.refreshToken;
    } else {
      refreshToken = req.cookies.refreshToken;
    }

    await logoutService(refreshToken);

    if (isMobile) {
      return res.status(200).json({
        statusCode: 200,
        isSuccess: true,
        message: "Logout successfully!",
      });
    } else {
      await res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
      return res.status(204).end(); 
    }
  } catch (err) {
    if (err.message === "Refresh token is required!") {
      return res.status(400).json({
        statusCode: 400,
        isSuccess: false,
        error: "Bad Request",
        message: err.message,
      });
    }
    if (err.message === 'Invalid refresh token!') {
      return res.status(401).json({
        statusCode: 401,
        isSuccess: false,
        error: 'Unauthorized',
        message: err.message,
      });
    }
    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
};

const sendMailResetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    await sendMailResetPasswordService({ email });
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      message: "Reset password email sent successfully!",
    });
  } catch (err) {
    if (err.message === "User not found!") {
      return res.status(404).json({
        statusCode: 404,
        isSuccess: false,
        error: "Not Found",
        message: err.message,
      });
    }
    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
};

const verifyResetPasswordTokenController = async (req, res) => {
  const { id, token } = req.body;
  try {
    const isVerified = await verifyResetPasswordTokenService(id, token);
    if (isVerified) {
      return res.status(200).json({
        statusCode: 200,
        isSuccess: true,
        message: "Valid reset password token!",
      });
    }
  } catch (err) {
    if (err.message === "Reset password token is required!") {
      return res.status(400).json({
        statusCode: 400,
        isSuccess: false,
        error: "Bad Request",
        message: err.message,
      });
    }
    if (err.message === "Invalid reset password token!") {
      return res.status(401).json({
        statusCode: 401,
        isSuccess: false,
        error: "Unauthorized",
        message: err.message,
      });
    }

    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
};

const resetPasswordController = async (req, res) => {
  const { id, newPassword } = req.body;
  try {
    await resetPasswordService(id, newPassword);

    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      message: "Password reset successfully!",
    });
  } catch (err) {
    if (err.message === "User not found!") {
      return res.status(404).json({
        statusCode: 404,
        isSuccess: false,
        error: "Not Found",
        message: err.message,
      });
    }

    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
};

const initiateRegistrationController = async (req, res) => {
  try {
    await initiateRegistrationService(req.body);
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      message: "Verify email sent successfully!",
    });
  } catch (err) {
    if (err.message === "Email already exists!") {
      return res.status(409).json({
        statusCode: 409,
        isSuccess: false,
        error: "Conflict",
        message: err.message,
      });
    }

    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
}

const verifyRegistrationController = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    await verifyOTPService(email, otpCode);
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      message: "Email verified successfully!",
    });
  } catch (err) {
    if (err.message === "OTP expired!") {
      return res.status(400).json({
        statusCode: 400,
        isSuccess: false,
        error: "Bad Request",
        message: err.message,
      });
    }
    if (err.message === "Invalid OTP!") {
      return res.status(401).json({
        statusCode: 401,
        isSuccess: false,
        error: "Unauthorized",
        message: err.message,
      });
    }
    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
}

export {
  loginUserController,
  loginAdminController,
  refreshTokenController,
  logoutController,
  sendMailResetPasswordController,
  verifyResetPasswordTokenController,
  resetPasswordController,
  initiateRegistrationController,
  verifyRegistrationController
};
