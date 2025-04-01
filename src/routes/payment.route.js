import express from "express";
import {
  createTransactionController,
  getUserTransactionsController,
  verifyTransactionController,
} from "../controller/payment.controller";
import {
  checkNotEmpty,
  checkPlanIdValid,
} from "../validations/auth.validation";
import {
  authenticateAccessToken,
  authorizeRoles,
  validate,
} from "../middleware/auth.middleware";
const router = express.Router();
const initTransactionRoutes = (app) => {
  router.post(
    "/:id",
    validate((req) => {
      checkNotEmpty(req.body.planId, "Plan ID");
      checkPlanIdValid(req.body.planId);
    }),
    authenticateAccessToken,
    authorizeRoles("unsubscriber", "subscriber"),
    createTransactionController
  );

  router.get(
    "/verify",
    authenticateAccessToken,
    authorizeRoles("unsubscriber", "subscriber"),
    verifyTransactionController
  );

  router.get(
    "/user/:id",
    authenticateAccessToken,
    authorizeRoles("subscriber"),
    getUserTransactionsController
  );
  return app.use("/api/v1/payments", router);
};
export default initTransactionRoutes;
