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
    console.error(err);
    throw err;
  }
};

const activateSubscriptionService = async (userId, planId) => {
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    await UserPlans.create({ user_id: user.id, plan_id: planId });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    throw err;
  }
};

const upgradeSubscriptionService = async (userId, newPlanId) => {
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    const latestCurrentSubscription = await UserPlans.findOne({
      where: { user_id: user.id },
      order: [['end_date', 'DESC']], 
    });

    if (latestCurrentSubscription.plan_id >= newPlanId) {
      throw new Error("Cannot downgrade subscription plan!");
    }

    await UserPlans.create({
      user_id: user.id,
      plan_id: newPlanId,
      start_date: latestCurrentSubscription.end_date,
    });

  } catch (err) {
    console.error(err);
    throw err;
  }
};

export { getAllSubscriptionsByUserIdService, activateSubscriptionService, deactivateSubscriptionService, upgradeSubscriptionService };
