import { verifyTokenService } from "../services/token.service";

const ACCESS_TOKEN_SECRET = Bun.env.ACCESS_TOKEN_SECRET;
const authenticateAccessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({
        statusCode: 401,
        isSuccess: false,
        error: "Unauthorized",
        message: "Access token is required!",
      });
    }

    const decodedAccessToken = await verifyTokenService(
      accessToken,
      ACCESS_TOKEN_SECRET
    );
    req.user = decodedAccessToken;
    next();
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      isSuccess: false,
      error: "Unauthorized",
      message: "User is not authenticated!",
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        statusCode: 403,
        isSuccess: false,
        error: "Forbidden",
        message: "You do not have permission to access this resource!",
      });
    }

    next();
  };
};

const validate = (cb) => {
  return (req, res, next) => {
    try {
      cb(req);
      next();
    } catch (err) {
      return res.status(400).json({
        statusCode: 400,
        isSuccess: false,
        error: "Bad Request",
        message: err.message,
      });
    }
  };
};

const validateFileImage = (err, req, res, next) => {
  if (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        statusCode: 400,
        isSuccess: false,
        error: "Bad Request",
        message: "File size exceeds the 5MB limit!",
      });
    }

    if (err.message === "INVALID_FILE_TYPE") {
      return res.status(400).json({
        statusCode: 400,
        isSuccess: false,
        error: "Bad Request",
        message: "Invalid file format! Only image files are allowed.",
      });
    }
  }

  next();
};

const validateFileVideo = (err, req, res, next) => {
  if (err?.message === "INVALID_VIDEO_FORMAT") {
    return res.status(400).json({
      statusCode: 400,
      isSuccess: false,
      error: "Bad Request",
      message: "Invalid video format! Accepted formats: MP4, AVI, MKV, MOV, FLV, WMV, MPEG, WebM",
    });
  }

  next();
};

export { authenticateAccessToken, authorizeRoles, validate, validateFileImage, validateFileVideo };
