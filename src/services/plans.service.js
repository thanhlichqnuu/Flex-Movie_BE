import Plans from "../models/plans.model";

const getAllPlansService = async () => {
  try {
    const listPlan = await Plans.findAll();
    return listPlan;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export { getAllPlansService };