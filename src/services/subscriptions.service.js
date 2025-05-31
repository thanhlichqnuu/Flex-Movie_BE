import Subscriptions from "../models/subscriptions.model";
import Users from "../models/users.model";
import Plans from "../models/plans.model";

const getSubscriptionByUserIdService = async (userId) => {
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    const subscription = await Subscriptions.findOne({
      where: { user_id: userId },
      attributes: { exclude: ["user_id", "plan_id"] },
      include: [
        {
          model: Plans,
          attributes: ["name"] 
        }
      ]
    });

    if (subscription) {
      const result = subscription.get({ plain: true});
      result.plan = result.plan?.name;
      
      return result;
    }
    
    return null;
  } catch (err) {
    throw err;
  }
};

const activateSubscriptionService = async (userId, planId, startDate = new Date()) => {
  try {
    await Subscriptions.create({ 
      user_id: userId, 
      plan_id: planId, 
      start_date: startDate 
    }, {
      fields: ['user_id', 'plan_id', 'start_date']
    });
  } catch (err) {
    throw err;
  }
};

const deactivateSubscriptionService = async (subscriptionId) => {
  try {
    const subscription = await Subscriptions.findByPk(subscriptionId);

    if (!subscription) {
      throw new Error("Subscription not found!");
    }

    await subscription.destroy();
  } catch (err) {
    throw err;
  }
};

export {
  getSubscriptionByUserIdService,
  activateSubscriptionService,
  deactivateSubscriptionService
};
