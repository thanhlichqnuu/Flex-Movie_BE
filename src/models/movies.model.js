import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import Countries from "./countries.model";

const Movies = sequelize.define(
  "movies",
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
      type: DataTypes.ENUM("Trailer", "Đang chiếu", "Hoàn tất"),
      allowNull: false,
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Countries,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    director: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    actor: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Đang cập nhật",
    },
    episode_current: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Đang cập nhật",
    },
    episode_total: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Đang cập nhật",
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
  },
  {
    tableName: "movies",
    timestamps: false,
  }
);

Movies.belongsTo(Countries, { foreignKey: "country_id" });

export default Movies;