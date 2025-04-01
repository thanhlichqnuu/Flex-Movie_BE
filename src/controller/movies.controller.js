import {
  getAllMoviesService,
  getMovieByIdService,
  createMovieService,
  updateMovieService,
  deleteMovieService,
} from "../services/movies.service";

const getAllMoviesController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 16,
      search = "",
      status = "",
      genre = "",
      country = "",
      releaseYear = "",
    } = req.query;

    const { count, rows: movies } = await getAllMoviesService(
      parseInt(page),
      parseInt(limit),
      search,
      status,
      genre,
      country,
      releaseYear
    );

    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: {
        totalMovie: count,
        page: parseInt(page),
        limit: parseInt(limit),
        data: movies,
      },
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
};

const getMovieByIdController = async (req, res) => {
  try {
    const movie = await getMovieByIdService(req.params.id);

    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: movie,
    });
  } catch (err) {
    if (err.message === "Movie not found!") {
      return res.status(404).json({
        statusCode: 404,
        isSuccess: false,
        error: "Not Found",
        message: err.message,
      });
    }
    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
};

const createMovieController = async (req, res) => {
  try {
    const movieData = {
      name: req.body.name,
      origin_name: req.body.originName,
      slug: req.body.slug,
      trailer_url: req.body.trailerUrl,
      description: req.body.description,
      release_year: req.body.releaseYear,
      status: req.body.status,
      country: req.body.country,
      director: req.body.director,
      actor: req.body.actor,
      duration: req.body.duration,
      episode_current: req.body.episodeCurrent,
      episode_total: req.body.episodeTotal,
    };

    const genres = JSON.parse(req.body.genres);

    await createMovieService(movieData, genres, req.files);

    return res.status(201).json({
      statusCode: 201,
      isSuccess: true,
      message: "Movie created successfully!",
    });
  } catch (err) {
    if (err.message === "Slug already exists!") {
      return res.status(409).json({
        statusCode: 409,
        isSuccess: false,
        error: "Conflict",
        message: err.message,
      });
    }
    if (
      err.message === "One or more genre do not exist!" ||
      err.message === "Country does not exist!"
    ) {
      return res.status(400).json({
        statusCode: 400,
        isSuccess: false,
        error: "Bad Request",
        message: err.message,
      });
    }
    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
};

const updateMovieController = async (req, res) => {
  try {
    const movieData = {};

    if (req.body.name) movieData.name = req.body.name;
    if (req.body.originName) movieData.origin_name = req.body.originName;
    if (req.body.slug) movieData.slug = req.body.slug;
    if (req.body.trailerUrl) movieData.trailer_url = req.body.trailerUrl;
    if (req.body.description) movieData.description = req.body.description;
    if (req.body.releaseYear) movieData.release_year = req.body.releaseYear;
    if (req.body.status) movieData.status = req.body.status;
    if (req.body.country) movieData.country = req.body.country;
    if (req.body.director) movieData.director = req.body.director;
    if (req.body.actor) movieData.actor = req.body.actor;
    if (req.body.duration) movieData.duration = req.body.duration;
    if (req.body.episodeCurrent)
      movieData.episode_current = req.body.episodeCurrent;
    if (req.body.episodeTotal) movieData.episode_total = req.body.episodeTotal;

    let genres = null;
    if (req.body.genres) {
      genres = JSON.parse(req.body.genres);
    }

    await updateMovieService(req.params.id, movieData, genres, req.files);

    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      message: "Movie updated successfully!",
    });
  } catch (err) {
    if (err.message === "Movie not found!") {
      return res.status(404).json({
        statusCode: 404,
        isSuccess: false,
        error: "Not Found",
        message: err.message,
      });
    }
    if (err.message === "Slug already exists!") {
      return res.status(409).json({
        statusCode: 409,
        isSuccess: false,
        error: "Conflict",
        message: err.message,
      });
    }
    if (
      err.message === "One or more genre do not exist!" ||
      err.message === "Country does not exist!"
    ) {
      return res.status(400).json({
        statusCode: 400,
        isSuccess: false,
        error: "Bad Request",
        message: err.message,
      });
    }
    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
};

const deleteMovieController = async (req, res) => {
  try {
    await deleteMovieService(req.params.id);
    return res.status(204).end();
  } catch (err) {
    if (err.message === "Movie not found!") {
      return res.status(404).json({
        statusCode: 404,
        isSuccess: false,
        error: "Not Found",
        message: err.message,
      });
    }
    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
};

export {
  getAllMoviesController,
  getMovieByIdController,
  createMovieController,
  updateMovieController,
  deleteMovieController,
};
