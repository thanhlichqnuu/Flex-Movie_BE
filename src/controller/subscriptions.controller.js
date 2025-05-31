import {
  getSubscriptionByUserIdService,
  deactivateSubscriptionService,
} from "../services/subscriptions.service";

const getSubscriptionByUserIdController = async (req, res) => {
  try {
    const subscription = await getSubscriptionByUserIdService(
      req.params.id
    );
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: subscription,
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
    if (err.message === "Subscription not found!") {
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
  getSubscriptionByUserIdController,
  deactivateSubscriptionController,
};
