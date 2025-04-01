import { getAllCountriesService } from "../services/countries.service";

const getAllCountriesController = async (req, res) => {
  try {
    const countries = await getAllCountriesService();
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: countries,
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

export { getAllCountriesController };
