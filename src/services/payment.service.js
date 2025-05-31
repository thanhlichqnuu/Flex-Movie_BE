import Transactions from "../models/transactions.model";
import Users from "../models/users.model";
import Plans from "../models/plans.model";
import { sequelize } from "../config/sequelize.config";
import { createPaymentLink, verifyPayment } from "./payos.service";
import {
  getSubscriptionByUserIdService,
  activateSubscriptionService,
  deactivateSubscriptionService
} from "./subscriptions.service";
import { getPlanByIdService } from "./plans.service";

const createTransactionService = async (userId, planId) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      throw new Error("User not found!");
    }
    const plan = await Plans.findByPk(planId);
    if (!plan) {
      throw new Error("Plan not found!");
    }

    const orderCode = Number(String(new Date().getTime()).slice(-6));
    let amount = plan.price;
    const currentSubscription = await getSubscriptionByUserIdService(userId);
    if (currentSubscription) {
      const currentPlan = await getPlanByIdService(currentSubscription.plan_id);
      amount = plan.price - currentPlan.price;
    }
    
    const newTransaction = await Transactions.create(
      {
        user_id: userId,
        plan_id: planId,
        amount: amount,
        order_code: orderCode,
      },
      { transaction }
    );
    const description = `${plan.name} Subscription 1M`;
    const paymentData = await createPaymentLink(
      orderCode,
      parseInt(amount),
      description
    );
    await transaction.commit();
    return {
      transactionId: newTransaction.id,
      orderCode: paymentData.orderCode,
      checkoutUrl: paymentData.checkoutUrl,
    };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const verifyTransactionService = async (orderCode) => {
  try {
    const paymentTransaction = await Transactions.findOne({
      where: { order_code: orderCode },
    });

    if (!paymentTransaction) {
      throw new Error("Transaction not found!");
    }

    const paymentStatus = await verifyPayment(orderCode);
    let status;

    if (paymentStatus.status === "PAID") {
      await paymentTransaction.update({ status: "paid" });

      try {
        const currentSubscription = await getSubscriptionByUserIdService(paymentTransaction.user_id);

        if (!currentSubscription) {
          await activateSubscriptionService(
            paymentTransaction.user_id,
            paymentTransaction.plan_id
          );
        } else if (currentSubscription.plan_id < paymentTransaction.plan_id) {
          await activateSubscriptionService(
            paymentTransaction.user_id,
            paymentTransaction.plan_id,
            currentSubscription.start_date
          );

          await deactivateSubscriptionService(currentSubscription.id);
        }
      } finally {
        status = "paid";
      }
    } else if (
      paymentStatus.status === "CANCELLED" ||
      paymentStatus.status === "EXPIRED" ||
      paymentStatus.status === "FAILED"
    ) {
      await paymentTransaction.update({ status: "cancelled" });
      status = "cancelled";
    }

    return { status };
  } catch (err) {
    await Transactions.update(
      { status: "cancelled" },
      { where: { order_code: orderCode } }
    );
    throw err;
  }
};

const getUserTransactionsService = async (userId) => {
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      throw new Error("User not found!");
    }
    const listTransaction = await Transactions.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Plans,
          attributes: ["name", "description", "price"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    return listTransaction;
  } catch (err) {
    throw err;
  }
};

export {
  createTransactionService,
  verifyTransactionService,
  getUserTransactionsService,
};
