import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import Users from "./users.model.js";
import Plans from "./plans.model.js";

const UserPlans = sequelize.define("user_plans", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  plan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Plans,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP + INTERVAL 1 MONTH"),
  },
}, {
  tableName: "user_plans",
  timestamps: false,
});

UserPlans.belongsTo(Users, { foreignKey: "user_id" });
UserPlans.belongsTo(Plans, { foreignKey: "plan_id" });

export default UserPlans;