import jwt from "jsonwebtoken";

const authenticateAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      isSuccess: false,
      error: "Unauthorized",
      message: "Access token is required!",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        statusCode: 401,
        isSuccess: false,
        error: "Unauthorized",
        message: "User is not authenticated!",
      });
    }

    req.user = user;
    next();
  });
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.Role.name)) {
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

const validate = (validationFunction) => {
  return (req, res, next) => {
    try {
      validationFunction(req);
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

export { authenticateAccessToken, authorizeRoles, validate };
