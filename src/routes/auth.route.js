import express from "express";
import {
  authenticateAccessToken,
  validate,
} from "../middleware/auth.middleware";
import {
  checkNotEmpty,
  checkPasswordLength,
  checkEmailValid,
} from "../validations/auth.validation";
import {
  registerUserController,
  loginUserController,
  loginAdminController,
  refreshTokenController,
  logoutController,
  sendMailResetPasswordController,
  verifyResetPasswordTokenController,
  resetPasswordController,
} from "../controller/auth.controller";

const router = express.Router();

const initAuthRoutes = (app) => {
  router.post(
    "/register",
    validate((req) => {
      checkNotEmpty(req.body.name, "Name")
      checkNotEmpty(req.body.email, "Email");
      checkNotEmpty(req.body.password, "Password");
      checkEmailValid(req.body.email);
      checkPasswordLength(req.body.password);
    }),
    registerUserController
  );

  router.post(
    "/user-login",
    validate((req) => {
      checkNotEmpty(req.body.email, "Email");
      checkNotEmpty(req.body.password, "Password");
      checkEmailValid(req.body.email);
      checkPasswordLength(req.body.password);
    }),
    loginUserController
  );
  router.post(
    "/admin-login",
    validate((req) => {
      checkNotEmpty(req.body.email, "Email");
      checkNotEmpty(req.body.password, "Password");
      checkEmailValid(req.body.email);
      checkPasswordLength(req.body.password);
    }),
    loginAdminController
  );
  router.post("/refresh-token", refreshTokenController);
  router.post("/logout", authenticateAccessToken, logoutController);
  router.post(
    "/forgot-password",
    validate((req) => {
      checkNotEmpty(req.body.email, "Email");
      checkEmailValid(req.body.email);
    }),
    sendMailResetPasswordController
  );
  router.post(
    "/verify-reset-password",
    validate((req) => {
      checkNotEmpty(req.body.id, "Id");
    }),
    verifyResetPasswordTokenController
  );
  router.patch(
    "/reset-password",
    validate((req) => {
      checkNotEmpty(req.body.id, "Id");
      checkNotEmpty(req.body.newPassword, "Password");
      checkPasswordLength(req.body.newPassword);
    }),
    resetPasswordController
  );
  return app.use("/api/v1/auth", router);
};

export default initAuthRoutes;
