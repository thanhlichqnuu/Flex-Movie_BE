import {
  getAllPlansService,
  createPlanService,
  updatePlanService,
  deletePlanService,
} from "../services/plans.service";

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

const createPlanController = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    await createPlanService({ name, description, price });

    return res.status(201).json({
      statusCode: 201,
      isSuccess: true,
      message: "Plan created successfully!",
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

const updatePlanController = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    await updatePlanService(req.params.id, { name, description, price });

    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      message: "Plan updated successfully!",
    });
  } catch (err) {
    if (err.message === "Plan not found!") {
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

const deletePlanController = async (req, res) => {
  try {
    await deletePlanService(req.params.id);
    return res.status(204).send();
  } catch (err) {
    if (err.message === "Plan not found!") {
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
  getAllPlansController,
  createPlanController,
  updatePlanController,
  deletePlanController,
};
