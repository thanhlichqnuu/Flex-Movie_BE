import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import Users from "./users.model";
import Plans from "./plans.model";

const Subscriptions = sequelize.define("subscriptions", {
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
  tableName: "subscriptions",
  timestamps: false,
});

Subscriptions.belongsTo(Users, { foreignKey: "user_id" });
Subscriptions.belongsTo(Plans, { foreignKey: "plan_id" });

export default Subscriptions;