import express from "express";
import {
  authenticateAccessToken,
  validate,
} from "../middleware/auth.middleware";
import {
  checkNotEmpty,
  checkPasswordLength,
  checkEmailValid,
  checkOTPValid
} from "../validations/auth.validation";
import {
  loginUserController,
  loginAdminController,
  refreshTokenController,
  logoutController,
  initiateResetPasswordController,
  resetPasswordController,
  initiateRegistrationController,
  verifyRegistrationController,
  verifyRegistrationAdminController
} from "../controller/auth.controller";

const router = express.Router();

const initAuthRoutes = (app) => {
  router.post(
    "/login",
    validate((req) => {
      checkNotEmpty(req.body.email, "Email");
      checkNotEmpty(req.body.password, "Password");
      checkEmailValid(req.body.email);
      checkPasswordLength(req.body.password);
    }),
    loginUserController
  );
  router.post(
    "/admin/login",
    validate((req) => {
      checkNotEmpty(req.body.email, "Email");
      checkNotEmpty(req.body.password, "Password");
      checkEmailValid(req.body.email);
      checkPasswordLength(req.body.password);
    }),
    loginAdminController
  );
  router.post("/token", refreshTokenController);
  router.post("/logout", authenticateAccessToken, logoutController);
  router.post(
    "/forgot-password",
    validate((req) => {
      checkNotEmpty(req.body.email, "Email");
      checkEmailValid(req.body.email);
    }),
    initiateResetPasswordController
  );
  router.patch(
    "/reset-password",
    validate((req) => {
      checkNotEmpty(req.body.email, "Email");
      checkNotEmpty(req.body.newPassword, "New password");
      checkNotEmpty(req.body.otpCode, "OTP");
      checkEmailValid(req.body.email);
      checkPasswordLength(req.body.newPassword);
      checkOTPValid(req.body.otpCode);
    }),
    resetPasswordController
  );
  router.post(
    "/register",
    validate((req) => {
      checkNotEmpty(req.body.name, "Name")
      checkNotEmpty(req.body.email, "Email");
      checkNotEmpty(req.body.password, "Password");
      checkEmailValid(req.body.email);
      checkPasswordLength(req.body.password);
    }),
    initiateRegistrationController
  );
  router.post(
    "/verify-registration",
    validate((req) => {
      checkNotEmpty(req.body.email, "Email");
      checkNotEmpty(req.body.otpCode, "OTP");
      checkEmailValid(req.body.email);
      checkOTPValid(req.body.otpCode);
    }),
    verifyRegistrationController
  );
  router.post(
    "/admin/verify-registration",
    validate((req) => {
      checkNotEmpty(req.body.email, "Email");
      checkNotEmpty(req.body.otpCode, "OTP");
      checkEmailValid(req.body.email);
      checkOTPValid(req.body.otpCode);
    }),
    verifyRegistrationAdminController
  );
  return app.use("/api/v1/auth", router);
};

export default initAuthRoutes;
