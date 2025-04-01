import UserPlans from "../models/user_plans.model";
import Users from "../models/users.model";

const getAllSubscriptionsByUserIdService = async (userId) => {
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    const listSubscription = await UserPlans.findAll({
      where: { user_id: userId },
      order: [["start_date", "ASC"]],
    });

    return listSubscription;
  } catch (err) {
    throw err;
  }
};

const activateSubscriptionService = async (userId, planId) => {
  try {
    await UserPlans.create({ user_id: userId, plan_id: planId });
  } catch (err) {
    throw err;
  }
};

const deactivateSubscriptionService = async (userPlanId) => {
  try {
    const userPlan = await UserPlans.findByPk(userPlanId);

    if (!userPlan) {
      throw new Error("Subscription plan not found!");
    }

    await userPlan.destroy();
  } catch (err) {
    throw err;
  }
};

const upgradeSubscriptionService = async (userId, newPlanId, startDate) => {
  try {
    await UserPlans.create({
      user_id: userId,
      plan_id: newPlanId,
      start_date: startDate,
    });
  } catch (err) {
    throw err;
  }
};

export {
  getAllSubscriptionsByUserIdService,
  activateSubscriptionService,
  deactivateSubscriptionService,
  upgradeSubscriptionService,
};
