import Users from "../models/users.model";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";

const getAllUsersService = async (page, limit, search, role, isBanned) => {
  const offset = (page - 1) * limit;
  const where = {};

  try {
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (role) {
      where.role_id = role;
    }

    if (isBanned) {
      where.is_banned = isBanned;
    }

    const listUser = await Users.findAndCountAll({
      where,
      attributes: { exclude: ["password"] },
      offset,
      limit,
      order: [["created_at", "ASC"]],
    });
    return listUser;
  } catch (err) {
    console.error(err);
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
    console.error(err);
    throw err;
  }
};

const createAdminService = async (userData) => {
  const { name, email, password } = userData;

  try {
    const existedUser = await Users.findOne({ where: { email } });
    if (existedUser) {
      throw new Error("Email already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Users.create({ name, email, password: hashedPassword, role_id: 1 });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    throw err;
  }
};

const toggleLockUserService = async (userId) => {
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      throw new Error("User not found!");
    }
    await user.update({ is_banned: !user.is_banned });
    return user
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const resetPasswordService = async (userId, newPassword) => {
  try {
    const user = await Users.findByPk(userId)
    if (!user) {
      throw new Error("User not found!");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await user.update({ password: hashPassword });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export {
  getAllUsersService,
  getUserByIdService,
  createAdminService,
  deleteUserService,
  toggleLockUserService,
  resetPasswordService,
};
