import express from "express";
import { getAllPlansController } from "../controller/plans.controller";

const router = express.Router();

const initPlansRoutes = (app) => {
  router.get("/get-all-plans", getAllPlansController);
  return app.use("/api/v1/plans", router);
};

export default initPlansRoutes;
