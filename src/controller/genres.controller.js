import { getAllGenresService } from "../services/genres.service";

const getAllGenresController = async (req, res) => {
  try {
    const genres = await getAllGenresService();
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: genres,
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

export { getAllGenresController };
