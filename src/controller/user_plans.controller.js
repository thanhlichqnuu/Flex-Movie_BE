import {
  getAllSubscriptionsByUserIdService,
  deactivateSubscriptionService,
} from "../services/user_plans.service";

const getAllSubscriptionsByUserIdController = async (req, res) => {
  try {
    const subscriptions = await getAllSubscriptionsByUserIdService(
      req.params.id
    );
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: subscriptions,
    });
  } catch (err) {
    if (err.message === "User not found!") {
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

const deactivateSubscriptionController = async (req, res) => {
  try {
    await deactivateSubscriptionService(req.params.id);

    return res.status(204).end();
  } catch (err) {
    if (err.message === "Subscription plan not found!") {
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
  getAllSubscriptionsByUserIdController,
  deactivateSubscriptionController,
};
