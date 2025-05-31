import {
  loginUserService,
  loginAdminService,
  refreshAccessToken,
  logoutService,
  initiateResetPasswordService,
  initiateRegistrationService,
  verifyOTPService,
} from "../services/auth.service";
import { createUserService } from "../services/users.service";
import { resetPasswordService } from "../services/users.service";

const REFRESH_TOKEN_TTL = parseInt(Bun.env.REFRESH_TOKEN_TTL);

const loginUserController = async (req, res) => {
  const isMobile = req.headers["x-client-type"] === "mobile";
  try {
    const { accessToken, refreshToken } = await loginUserService(req.body);

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
    }
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
  const isMobile = req.headers["x-client-type"] === "mobile";
  try {
    let refreshToken;
    if (isMobile) {
      refreshToken = req.body.refreshToken;
    } else {
      refreshToken = req.cookies.refreshToken;
    }

    const { newAccessToken, newRefreshToken } = await refreshAccessToken(
      refreshToken
    );

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
        sameSite: "lax",
        maxAge: REFRESH_TOKEN_TTL * 1000,
        path: "/",
      };
      await res.cookie("refreshToken", newRefreshToken, cookieOptions);

      return res.status(200).json({
        statusCode: 200,
        isSuccess: true,
        result: { accessToken: newAccessToken },
      });
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
    if (err.message === "Invalid refresh token!") {
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

const logoutController = async (req, res) => {
  const isMobile = req.headers["x-client-type"] === "mobile";
  try {
    let refreshToken;

    if (isMobile) {
      refreshToken = req.body.refreshToken;
    } else {
      refreshToken = req.cookies.refreshToken;
    }

    await logoutService(refreshToken);

    if (isMobile) {
      return res.status(204).end();
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
    if (err.message === "Invalid refresh token!") {
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

const initiateResetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    await initiateResetPasswordService(email);
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

const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, otpCode } = req.body;
    const userData = await verifyOTPService(email, otpCode, "resetpassword");
    if (userData) {
      await resetPasswordService(email, newPassword);

      return res.status(200).json({
        statusCode: 200,
        isSuccess: true,
        message: "Password reset successfully!",
      });
    }
  } catch (err) {
    if (err.message === "User not found!") {
      return res.status(404).json({
        statusCode: 404,
        isSuccess: false,
        error: "Not Found",
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
};

const initiateRegistrationController = async (req, res) => {
  try {
    await initiateRegistrationService(req.body);
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      message: "Verification email sent successfully!",
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
};

const resendRegistrationOTPController = async (req, res) => {
  try {
    await initiateRegistrationService({...req.body, resend: true});
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      message: "Verification email resent successfully!",
    });
  } catch (err) {
    if (err.message === "Invalid email verification!") {
      return res.status(400).json({
        statusCode: 400,
        isSuccess: false,
        error: "Bad Request",
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

const verifyRegistrationController = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    const userData = await verifyOTPService(email, otpCode, "registration");
    await createUserService(userData);
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      message: "Email verified successfully!",
    });
  } catch (err) {
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
};

const verifyRegistrationAdminController = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    const userData = await verifyOTPService(email, otpCode, "registration");
    await createUserService(userData, 1);
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      message: "Email verified successfully!",
    });
  } catch (err) {
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
};

export {
  loginUserController,
  loginAdminController,
  refreshTokenController,
  logoutController,
  initiateResetPasswordController,
  resetPasswordController,
  initiateRegistrationController,
  resendRegistrationOTPController,
  verifyRegistrationController,
  verifyRegistrationAdminController,
};
