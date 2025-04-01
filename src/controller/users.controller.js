import {
  getAllUsersService,
  getUserByIdService,
  deleteUserService,
  changePasswordService,
} from "../services/users.service";

const getAllUsersController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
    } = req.query;
    const { count, rows: users } = await getAllUsersService(
      page,
      limit,
      search,
      role,
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
      message: "An unexpected error occurred. Please try again later!",
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
      message: "An unexpected error occurred. Please try again later!",
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
      message: "An unexpected error occurred. Please try again later!",
    });
  }
};

const changePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await changePasswordService(req.params.id, oldPassword, newPassword);

    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      message: "Password changed successfully!",
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
    if (err.message === "Incorrect old password!") {
      return res.status(401).json({
        statusCode: 401,
        isSuccess: false,
        error: "Unauthorized",
        message: err.message,
      });
    }
    if (
      err.message ===
      "The new password cannot be the same as the current password!"
    ) {
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

export {
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  changePasswordController,
};
