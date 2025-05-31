import express from "express";
import {
  createTransactionController,
  getUserTransactionsController,
  verifyTransactionController,
} from "../controller/payment.controller";
import {
  checkNotEmpty
} from "../validations/auth.validation";
import {
  authenticateAccessToken,
  authorizeRoles,
  validate,
} from "../middleware/auth.middleware";
const router = express.Router();
const initTransactionRoutes = (app) => {
  router.post(
    "/users/:id",
    validate((req) => {
      checkNotEmpty(req.body.planId, "Plan ID");
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
    "/users/:id",
    authenticateAccessToken,
    authorizeRoles("subscriber"),
    getUserTransactionsController
  );
  return app.use("/api/v1/payments", router);
};
export default initTransactionRoutes;
