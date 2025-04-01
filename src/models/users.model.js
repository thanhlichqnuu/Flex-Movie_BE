import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import Roles from "./roles.model";

const Users = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3,
    references: {
      model: Roles, 
      key: "id"
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
}, {
  tableName: "users",
  timestamps: false,
});

Users.belongsTo(Roles, { foreignKey: "role_id" });

export default Users;
