import express from "express";
import { getSubscriptionByUserIdController, deactivateSubscriptionController } from "../controller/subscriptions.controller";
import {
  authenticateAccessToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = express.Router();

const initSubscriptionsRoutes = (app) => {
  router.get(
    "/users/:id",
    authenticateAccessToken,
    authorizeRoles("subscriber"),
    getSubscriptionByUserIdController
  );
  router.delete(
    "/:id",
    authenticateAccessToken,
    authorizeRoles("subscriber"),
    deactivateSubscriptionController
  );
  return app.use("/api/v1/subscriptions", router);
};

export default initSubscriptionsRoutes
