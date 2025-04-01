import Plans from "../models/plans.model";

const getAllPlansService = async () => {
  try {
    const listPlan = await Plans.findAll();
    return listPlan;
  } catch (err) {
    throw err;
  }
};

const createPlanService = async (planData) => {
  try {
    await Plans.create(planData);
  } catch (err) {
    throw err;
  }
};

const updatePlanService = async (planId, planData) => {
  try {
    const existedPlan = await Plans.findByPk(planId);

    if (!existedPlan) {
      throw new Error("Plan not found!");
    }

    if (planData.name) {
      existedPlan.name = planData.name;
    }
    if (planData.description) {
      existedPlan.description = planData.description;
    }
    if (planData.price) {
      existedPlan.price = planData.price;
    }

    await existedPlan.save();
  } catch (err) {
    throw err;
  }
};

const deletePlanService = async (planId) => {
  try {
    const existedPlan = await Plans.findByPk(planId);

    if (!existedPlan) {
      throw new Error("Plan not found!");
    }

    await existedPlan.destroy();
  } catch (err) {
    throw err;
  }
};

export { getAllPlansService, createPlanService, updatePlanService, deletePlanService };
