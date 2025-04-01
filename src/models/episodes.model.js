import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import Movies from "./movies.model";

const Episodes = sequelize.define("episodes", {
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
  },
  link_m3u8: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  movie_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Movies,
      key: "id",
    },
    onDelete: "CASCADE",
  },
}, {
  tableName: "episodes",
  timestamps: false,
});

Episodes.belongsTo(Movies, { foreignKey: "movie_id" });

export default Episodes;