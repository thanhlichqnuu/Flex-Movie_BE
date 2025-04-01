import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.config";

const MovieGenres = sequelize.define(
  "movie_genres",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "movie_genres",
    timestamps: false,
  }
);

export default MovieGenres;