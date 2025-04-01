import express from "express";
import { getAllSubscriptionsByUserIdController, deactivateSubscriptionController } from "../controller/user_plans.controller";
import {
  authenticateAccessToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = express.Router();

const initUserPlansRoutes = (app) => {
  router.get(
    "/user/:id",
    authenticateAccessToken,
    authorizeRoles("subscriber"),
    getAllSubscriptionsByUserIdController
  );
  router.delete(
    "/:id",
    authenticateAccessToken,
    authorizeRoles("subscriber"),
    deactivateSubscriptionController
  );
  return app.use("/api/v1/subscriptions", router);
};

export default initUserPlansRoutes;
