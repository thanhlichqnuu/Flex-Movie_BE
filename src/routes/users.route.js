import express from "express";
import {
  getAllUsersController,
    getUserByIdController,
    createAdminController,
    deleteUserController,
    toggleLockUserController,
} from "../controller/users.controller";
import {
  checkNotEmpty,
  checkPasswordLength,
  checkEmailValid,
} from "../validations/auth.validation";
import { authenticateAccessToken, authorizeRoles, validate } from "../middleware/auth.middleware";

const router = express.Router();

const initUsersRoutes = (app) => {
  router.get(
    "/get-all-users",
    authenticateAccessToken,
    authorizeRoles("admin"),
    getAllUsersController
  );
  router.get(
    "/get-user-by-id/:id",
    authenticateAccessToken,
    authorizeRoles("admin", "subscriber"),
    getUserByIdController
  );
  router.post(
    "/create-admin",
    validate((req) => {
      checkNotEmpty(req.body.name, "Name")
      checkNotEmpty(req.body.email, "Email");
      checkNotEmpty(req.body.password, "Password");
      checkEmailValid(req.body.email);
      checkPasswordLength(req.body.password);
    }),
    authenticateAccessToken,
    authorizeRoles("admin"),
    createAdminController
  );
  router.delete(
    "/delete-user/:id",
    authenticateAccessToken,
    authorizeRoles("admin", "subscriber"),
    deleteUserController
  );
  router.patch(
    "/lock-user/:id",
    authenticateAccessToken,
    authorizeRoles("admin"),
    toggleLockUserController
  );
  return app.use("/api/v1/users", router);
};

export default initUsersRoutes;
