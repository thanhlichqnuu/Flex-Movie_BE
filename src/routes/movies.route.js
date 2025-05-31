import express from "express";
import {
  checkNotEmpty,
  checkMovieStatusValid,
  checkMovieReleaseYearValid,
  checkImageNotEmpty,
  checkGenresValid,
  checkIntegerNumber,
} from "../validations/auth.validation";
import { validate } from "../middleware/auth.middleware";
import { imageUpload } from "../utils/multer.util";
import { validateFileImage } from "../middleware/auth.middleware";
import {
  getAllMoviesController,
  getMovieBySlugController,
  createMovieController,
  updateMovieController,
  deleteMovieController,
} from "../controller/movies.controller";
import {
  authenticateAccessToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = express.Router();

const initMoviesRoutes = (app) => {
  router.get(
    "/",
    authenticateAccessToken,
    authorizeRoles("admin", "subscriber"),
    getAllMoviesController
  );
  router.get(
    "/:slug",
    authenticateAccessToken,
    authorizeRoles("admin", "subscriber"),
    getMovieBySlugController
  );
  router.post(
    "/",
    imageUpload.fields([
      { name: "thumbUrl", maxCount: 1 },
      { name: "posterUrl", maxCount: 1 },
    ]),
    validate((req) => {
      checkNotEmpty(req.body.name, "Name");
      checkNotEmpty(req.body.originName, "Origin name");
      checkNotEmpty(req.body.slug, "Slug");
      checkNotEmpty(req.body.description, "Description");
      checkNotEmpty(req.body.releaseYear, "Release year");
      checkNotEmpty(req.body.status, "Status");
      checkNotEmpty(req.body.country, "Country");
      checkNotEmpty(req.body.director, "Director");
      checkNotEmpty(req.body.actor, "Actor");
      checkGenresValid(req.body.genres, "Genres");
      checkIntegerNumber(req.body.country, "Country");
      checkMovieReleaseYearValid(req.body.releaseYear);
      checkMovieStatusValid(req.body.status);
      checkImageNotEmpty(req.files, "thumbUrl");
      checkImageNotEmpty(req.files, "posterUrl");
    }),
    validateFileImage,
    authenticateAccessToken,
    authorizeRoles("admin"),
    createMovieController
  );
  router.patch(
    "/:id",
    imageUpload.fields([
      { name: "thumbUrl", maxCount: 1 },
      { name: "posterUrl", maxCount: 1 },
    ]),
    validate((req) => {
      if (req.body.status) checkMovieStatusValid(req.body.status);
      if (req.body.releaseYear)
        checkMovieReleaseYearValid(req.body.releaseYear);
      if (req.body.country) checkIntegerNumber(req.body.country, "Country");
      if (req.body.genres) checkGenresValid(req.body.genres, "Genres");
    }),
    validateFileImage,
    authenticateAccessToken,
    authorizeRoles("admin"),
    updateMovieController
  );
  router.delete(
    "/:id",
    authenticateAccessToken,
    authorizeRoles("admin"),
    deleteMovieController
  );

  return app.use("/api/v1/movies", router);
};

export default initMoviesRoutes;
