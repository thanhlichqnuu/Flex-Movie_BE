import express from "express";
import { getAllPlansController, createPlanController, updatePlanController, deletePlanController } from "../controller/plans.controller";
import {
  authenticateAccessToken,
  authorizeRoles,
  validate,
} from "../middleware/auth.middleware";
import { checkNotEmpty, checkIntegerNumber } from "../validations/auth.validation";

const router = express.Router();

const initPlansRoutes = (app) => {
  router.get(
    "/",
    authenticateAccessToken,
    getAllPlansController
  );
  router.post(
    "/",
    validate((req) => {
      checkNotEmpty(req.body.name, "Name");
      checkNotEmpty(req.body.price, "Price");
      checkIntegerNumber(req.body.price, "Price");
    }),
    authenticateAccessToken,
    authorizeRoles("admin"),
    createPlanController
  );
  router.patch(
    "/:id",
    authenticateAccessToken,
    authorizeRoles("admin"),
    updatePlanController
  );
  router.delete(
    "/:id",
    authenticateAccessToken,
    authorizeRoles("admin"),
    deletePlanController
  );
  return app.use("/api/v1/plans", router);
};

export default initPlansRoutes;
