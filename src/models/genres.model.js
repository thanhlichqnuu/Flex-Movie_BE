import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

const Genres = sequelize.define("genres", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "genres",
  timestamps: false,
});

export default Genres;