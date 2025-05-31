import { getEpisodesByMovieService, createEpisodeService, updateEpisodeService, deleteEpisodeService } from "../services/episodes.service";

const getEpisodesByMovieController = async (req, res) => {
  try {
    const episodes = await getEpisodesByMovieService(req.params.slug);
    
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: {
        data: episodes
      } 
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

const createEpisodeController = async (req, res) => {
  try {
    const episodeData = {
      name: req.body.name,
      slug: req.body.slug,
    };

    await createEpisodeService(episodeData, req.body.movieId, req.file);

    return res.status(201).json({
      statusCode: 201,
      isSuccess: true,
      message: "Episode created successfully!",
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

    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
};

const updateEpisodeController = async (req, res) => {
  try {
    const updateData = {};
    
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.slug) updateData.slug = req.body.slug;
    
    await updateEpisodeService(req.params.id, updateData, req.file);
    
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      message: "Episode updated successfully!",
    });
  } catch (err) {
    if (err.message === "Episode not found!") {
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
    
    return res.status(500).json({
      statusCode: 500,
      isSuccess: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later!",
    });
  }
};

const deleteEpisodeController = async (req, res) => {
  try {
    await deleteEpisodeService(req.params.id);
    return res.status(204).end();
  } catch (err) {
    if (err.message === "Episode not found!") {
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

export { getEpisodesByMovieController, createEpisodeController, updateEpisodeController, deleteEpisodeController };
