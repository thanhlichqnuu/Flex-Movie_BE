import { Sequelize } from "sequelize";

const DB_NAME = Bun.env.DB_NAME;
const DB_USER = Bun.env.DB_USER;
const DB_PASSWORD = Bun.env.DB_PASSWORD;
const DB_HOST = Bun.env.DB_HOST;
const DB_DIALECT = Bun.env.DB_DIALECT;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,
});

const connectMySQL = async () => {
    try {
        await sequelize.authenticate();
        console.log("MySQL connection has been established successfully!");
    }
    catch (err) {
        console.error("Failed to connect to MySQL:", err);
        throw err
    }
}

export { sequelize, connectMySQL };