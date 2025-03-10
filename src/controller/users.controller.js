import {
  getAllUsersService,
  getUserByIdService,
  createAdminService,
  deleteUserService,
  toggleLockUserService,
} from "../services/users.service";

const getAllUsersController = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "", isBanned = "" } = req.query;
    const { count, rows: users } = await getAllUsersService(
      page,
      limit,
      search,
      role, 
      isBanned
    );

    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: {
        totalUser: count,
        page: parseInt(page),
        limit: parseInt(limit),
        data: users,
      },
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!"
    });
  }
};

const getUserByIdController = async (req, res) => {
  try {
    const users = await getUserByIdService(req.params.id);
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: users,
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
      message: "An unexpected error occurred. Please try again later!"
    });
  }
};

const createAdminController = async (req, res) => {
  try {
    await createAdminService(req.body);
    return res.status(201).json({
      statusCode: 201,
      isSuccess: true,
      message: "Admin created successfully!",
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
      message: "An unexpected error occurred. Please try again later!"
    });
  }
};

const deleteUserController = async (req, res) => {
  try {
    await deleteUserService(req.params.id);
    return res.status(204).end();
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
      message: "An unexpected error occurred. Please try again later!"
    });
  }
};

const toggleLockUserController = async (req, res) => {
    try {
      const user = await toggleLockUserService(req.params.id);
      
      return res.status(200).json({
        statusCode: 200,
        isSuccess: true,
        message: user.is_banned ? `User locked successfully!` : `User unlocked successfully!`,
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
        message: "An unexpected error occurred. Please try again later!"
      });
    }
  };

export {
  getAllUsersController,
  getUserByIdController,
  createAdminController,
  deleteUserController,
  toggleLockUserController,
};
