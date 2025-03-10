import express from "express";
import { getAllSubscriptionsByUserIdController, activateSubscriptionController, deactivateSubscriptionController, upgradeSubscriptionController } from "../controller/user_plans.controller";
import {
  checkNotEmpty,
  checkPlanIdValid
} from "../validations/auth.validation";
import {
  authenticateAccessToken,
  authorizeRoles,
  validate,
} from "../middleware/auth.middleware";

const router = express.Router();

const initUserPlansRoutes = (app) => {
  router.get(
    "/get-all-subscriptions-by-userid/:userId",
    authenticateAccessToken,
    authorizeRoles("subscriber"),
    getAllSubscriptionsByUserIdController
  );
  router.post(
    "/activate-subscription/:userId",
    validate((req) => {
      checkNotEmpty(req.body.planId, "Plan Id");
      checkPlanIdValid(req.body.planId);
    }),
    authenticateAccessToken,
    authorizeRoles("unsubscriber"),
    activateSubscriptionController
  );
  router.delete(
    "/deactivate-subscription/:userPlanId",
    authenticateAccessToken,
    authorizeRoles("subscriber"),
    deactivateSubscriptionController
  );
  router.post(
    "/upgrade-subscription/:userId",
    validate((req) => {
      checkNotEmpty(req.body.planId, "Plan Id");
      checkPlanIdValid(req.body.planId);
    }),
    authenticateAccessToken,
    authorizeRoles("subscriber"),
    upgradeSubscriptionController
  );
  return app.use("/api/v1/user-plans", router);
};

export default initUserPlansRoutes;
