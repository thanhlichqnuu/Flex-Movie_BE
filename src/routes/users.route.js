import express from "express";
import {
  getAllUsersController,
    getUserByIdController,
    deleteUserController,
    changePasswordController
} from "../controller/users.controller";
import { authenticateAccessToken, authorizeRoles, validate } from "../middleware/auth.middleware";
import { checkNotEmpty, checkPasswordLength } from "../validations/auth.validation";

const router = express.Router();

const initUsersRoutes = (app) => {
  router.get(
    "/",
    authenticateAccessToken,
    authorizeRoles("admin"),
    getAllUsersController
  );
  router.get(
    "/:id",
    authenticateAccessToken,
    authorizeRoles("admin", "subscriber"),
    getUserByIdController
  );
  router.delete(
    "/:id",
    authenticateAccessToken,
    authorizeRoles("admin", "subscriber"),
    deleteUserController
  );
  router.patch(
    "/change-password/:id",
    validate((req) => {
      checkNotEmpty(req.body.oldPassword, "Old password");
      checkNotEmpty(req.body.newPassword, "New password");
      checkPasswordLength(req.body.oldPassword);
      checkPasswordLength(req.body.newPassword);
    }),
    authenticateAccessToken,
    authorizeRoles("admin", "subscriber"),
    changePasswordController
  );
  return app.use("/api/v1/users", router);
};

export default initUsersRoutes;
