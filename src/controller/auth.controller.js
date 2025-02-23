import {
  registerUserService,
  loginUserService,
  loginAdminService,
  refreshAccessToken,
  logoutService,
} from "../services/auth.service";

const REFRESH_TOKEN_TTL = parseInt(Bun.env.REFRESH_TOKEN_TTL);

const registerUserController = async (req, res) => {
  try {
    await registerUserService(req.body);
    res.status(201).json({
      statusCode: 201,
      isSuccess: true,
      message: "User registered successfully!",
    });
  } catch (err) {
    console.error(err);
    if (err.message === "Email is already exists!") {
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

const loginUserController = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await loginUserService(req.body);
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_TTL * 1000,
      path: "/",
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: { accessToken: accessToken },
    });
  } catch (err) {
    console.error(err);
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
      message: "An unexpected error occurred. Please try again later.",
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
    res.cookie("refreshToken", refreshToken, cookieOptions);
    
    res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: { accessToken: accessToken },
    });
  } catch (err) {
    console.error(err);
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
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    const { newAccessToken, newRefreshToken } = await refreshAccessToken(
      refreshToken
    );
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_TTL * 1000,
      path: "/",
    };
    res.cookie('refreshToken', newRefreshToken, cookieOptions);

    res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: { accessToken: newAccessToken },
    });
  } catch (err) {
    console.error(err);
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

    if (err.message === "Refresh token is invalid or expired!") {
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
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const logoutController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    await logoutService(refreshToken);
    
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
  });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    if (err.message === "Refresh token is missing!") {
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
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

export {
  registerUserController,
  loginUserController,
  loginAdminController,
  refreshTokenController,
  logoutController,
};
