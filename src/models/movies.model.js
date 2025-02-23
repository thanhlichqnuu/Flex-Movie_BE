import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import Genres from "./genres.model.js";
import Countries from "./countries.model.js";

const Movies = sequelize.define("movies", {
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
  origin_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  thumb_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  poster_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  trailer_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  release_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('trailer', 'ongoing', 'completed'),
    allowNull: false,
  },
  genre_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Genres,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  country_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Countries,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  director: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  actor: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  episode_current: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  episode_total: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  is_premium: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: db.literal("CURRENT_TIMESTAMP"),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: db.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
  },
}, {
  tableName: "movies",
  timestamps: false,
});

Movies.belongsTo(Genres, { foreignKey: "genre_id" });
Movies.belongsTo(Countries, { foreignKey: "country_id" });

export default Movies;