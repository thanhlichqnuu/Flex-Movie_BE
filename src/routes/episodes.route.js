import express from "express";
import {
  getEpisodesByMovieController,
  createEpisodeController,
  updateEpisodeController,
  deleteEpisodeController,
} from "../controller/episodes.controller";
import { videoUpload } from "../utils/multer.util";
import {
  authenticateAccessToken,
  authorizeRoles,
  validate,
  validateFileVideo,
} from "../middleware/auth.middleware";
import {
  checkNotEmpty,
  checkIntegerNumber,
  checkVideoNotEmpty,
} from "../validations/auth.validation";

const router = express.Router();

const initEpisodesRoutes = (app) => {
  router.get(
    "/:id",
    authenticateAccessToken,
    authorizeRoles("admin"),
    getEpisodesByMovieController
  );
  router.post(
    "/",
    videoUpload.single("episodeUrl"),
    validate((req) => {
      checkNotEmpty(req.body.name, "Name");
      checkNotEmpty(req.body.slug, "Slug");
      checkNotEmpty(req.body.movieId, "Movie ID");
      checkIntegerNumber(req.body.movieId, "Movie ID");
      checkVideoNotEmpty(req.file, "episodeUrl");
    }),
    validateFileVideo,
    authenticateAccessToken,
    authorizeRoles("admin"),
    createEpisodeController
  );
  router.patch(
    "/:id",
    videoUpload.single("video"),
    validateFileVideo,
    authenticateAccessToken,
    authorizeRoles("admin"),
    updateEpisodeController
  );
  router.delete(
    "/:id",
    authenticateAccessToken,
    authorizeRoles("admin"),
    deleteEpisodeController
  );
  return app.use("/api/v1/episodes", router);
};

export default initEpisodesRoutes;
