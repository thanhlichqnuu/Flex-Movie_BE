import { getAllSubscriptionsByUserIdService, activateSubscriptionService, deactivateSubscriptionService, upgradeSubscriptionService } from "../services/user_plans.service";

const getAllSubscriptionsByUserIdController = async (req, res) => {
  try {
    const subscriptions = await getAllSubscriptionsByUserIdService(req.params.userId);
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
      message: "An unexpected error occurred. Please try again later!"
    });
  }
};

const activateSubscriptionController = async (req, res) => {
    try {
      await activateSubscriptionService(req.params.userId, req.body.planId);
      
      return res.status(201).json({
        statusCode: 201,
        isSuccess: true,
        message: "Activate subscription plan successfully!",
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
        message: "An unexpected error occurred. Please try again later!"
      });
    }
  };

  const deactivateSubscriptionController = async (req, res) => {
    try {
      await deactivateSubscriptionService(req.params.userPlanId);
      
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
        message: "An unexpected error occurred. Please try again later!"
      });
    }
  };

  const upgradeSubscriptionController = async (req, res) => {
    try {
      await upgradeSubscriptionService(req.params.userId, req.body.planId);
  
      res.status(201).json({
        statusCode: 201,
        isSuccess: true,
        message: "Subscription upgraded successfully!",
      });
    } catch (err) {
      if (err.message === "User not found!") {
        return res.status(404).json({
          statusCode: 404,
          isSuccess: false,
          error: "Not Found",
          message: err.message,
        });
      } else if (err.message === "Cannot downgrade subscription plan!") {
        return res.status(400).json({
          statusCode: 400,
          isSuccess: false,
          error: "Bad Request",
          message: err.message,
        });
      } else {
        console.error(err);
        return res.status(500).json({
          statusCode: 500,
          isSuccess: false,
          error: "Internal Server Error",
          message: "An unexpected error occurred. Please try again later!",
        });
      }
    }
  };

  export { getAllSubscriptionsByUserIdController, activateSubscriptionController, deactivateSubscriptionController, upgradeSubscriptionController }