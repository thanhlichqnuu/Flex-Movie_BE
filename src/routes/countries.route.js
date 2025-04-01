import express from "express";
import { getAllCountriesController } from "../controller/countries.controller";
import { authenticateAccessToken } from "../middleware/auth.middleware";

const router = express.Router();

const initCountriesRoutes = (app) => {
  router.get("/", authenticateAccessToken, getAllCountriesController);
  return app.use("/api/v1/countries", router);
};

export default initCountriesRoutes;
