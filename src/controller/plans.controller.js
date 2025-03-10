import { getAllPlansService } from "../services/plans.service";

const getAllPlansController = async (req, res) => {
  try {
    const plans = await getAllPlansService();
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: plans,
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

export { getAllPlansController};
