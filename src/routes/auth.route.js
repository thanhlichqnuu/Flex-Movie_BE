import express from "express";
import {
  authenticateAccessToken,
  validate,
} from "../middleware/auth.middleware";
import {
  validateEmailInput,
  validatePasswordInput,
  validateNameInput,
} from "../validations/auth.validation";
import {
  registerUserController,
  loginUserController,
  loginAdminController,
  refreshTokenController,
  logoutController,
} from "../controller/auth.controller";

const router = express.Router();

const initAuthRoutes = (app) => {
  router.post(
    "/register",
    validate((req) => {
      validateEmailInput(req.body.email);
      validatePasswordInput(req.body.password);
      validateNameInput(req.body.name);
    }),
    registerUserController
  );

  router.post(
    "/user-login",
    validate((req) => {
      validateEmailInput(req.body.email);
      validatePasswordInput(req.body.password);
    }),
    loginUserController
  );
  router.post(
    "/admin-login",
    validate((req) => {
      validateEmailInput(req.body.email);
      validatePasswordInput(req.body.password);
    }),
    loginAdminController
  );
  router.post("/refresh-token", refreshTokenController);
  router.post("/logout", authenticateAccessToken, logoutController);
  return app.use("/api/v1/auth", router);
};

export default initAuthRoutes;
