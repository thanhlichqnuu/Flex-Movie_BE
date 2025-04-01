import express from "express";
import { getAllGenresController } from "../controller/genres.controller";
import { authenticateAccessToken } from "../middleware/auth.middleware";

const router = express.Router();

const initGenresRoutes = (app) => {
  router.get("/", authenticateAccessToken, getAllGenresController);
  return app.use("/api/v1/genres", router);
};

export default initGenresRoutes;
