import Users from "../models/users.model";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";

const getAllUsersService = async (page, limit, search, role) => {
  const offset = (page - 1) * limit;
  const where = {};

  try {
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (role) {
      where.role_id = role;
    }

    const listUser = await Users.findAndCountAll({
      where,
      attributes: { exclude: ["password", "created_at", "updated_at"] },
      offset,
      limit,
      order: [["created_at", "ASC"]],
    });
    return listUser;
  } catch (err) {
    throw err;
  }
};

const getUserByIdService = async (userId) => {
  try {
    const user = await Users.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw new Error("User not found!");
    }
    return user;
  } catch (err) {
    throw err;
  }
};

const deleteUserService = async (userId) => {
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      throw new Error("User not found!");
    }
    await user.destroy();
  } catch (err) {
    throw err;
  }
};

const resetPasswordService = async (email, newPassword) => {
  try {
    const existedUser = await Users.findOne({
      where: { email },
    });

    if (!existedUser) {
      throw new Error("User not found!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await existedUser.update({ password: hashPassword });
  } catch (err) {
    throw err;
  }
};

const changePasswordService = async (userId, oldPassword, newPassword) => {
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    const isMatchOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isMatchOldPassword) {
      throw new Error("Incorrect old password!");
    }

    const isPasswordSame = await bcrypt.compare(newPassword, user.password);
    if (isPasswordSame) {
      throw new Error(
        "The new password cannot be the same as the current password!"
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await user.update({ password: hashPassword });
  } catch (err) {
    throw err;
  }
};

const createUserService = async (userData, roleId = 3) => {
  const { name, email, password } = userData;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await Users.create({
      name,
      email,
      password: hashPassword,
      role_id: roleId,
    });
  } catch (err) {
    throw err;
  }
};

export {
  getAllUsersService,
  getUserByIdService,
  deleteUserService,
  resetPasswordService,
  changePasswordService,
  createUserService,
};
