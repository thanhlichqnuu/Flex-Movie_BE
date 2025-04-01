import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.config";

const Countries = sequelize.define(
  "countries",
  {
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
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "countries",
    timestamps: false,
  }
);

export default Countries;
