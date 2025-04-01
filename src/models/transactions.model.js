import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import Users from "./users.model";
import Plans from "./plans.model";

const Transactions = sequelize.define("transactions", {
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
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  order_code: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "paid", "cancelled"),
    allowNull: false,
    defaultValue: "pending",
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
}, {
  tableName: "transactions",
  timestamps: false,
});

Transactions.belongsTo(Users, { foreignKey: "user_id" });
Transactions.belongsTo(Plans, { foreignKey: "plan_id" });

export default Transactions;
