import {
  createTransactionService,
  verifyTransactionService,
  getUserTransactionsService,
} from "../services/payment.service";

const createTransactionController = async (req, res) => {
  try {
    const { planId } = req.body;
    const result = await createTransactionService(req.params.id, planId);
    return res.status(201).json({
      statusCode: 201,
      isSuccess: true,
      message: "Payment link created successfully!",
      result: result,
    });
  } catch (err) {
    if (err.message === "User not found!" || err.message === "Plan not found!") {
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

const verifyTransactionController = async (req, res) => {
  try {
    const { orderCode } = req.query;
    const result = await verifyTransactionService(orderCode);

    if (result.status === "paid") {
      return res.redirect(
        `http://localhost:3030/payment-success?orderCode=${orderCode}`
      );
    } else if (result.status === "cancelled") {
      return res.redirect(
        `http://localhost:3030/payment-cancelled?orderCode=${orderCode}`
      );
    }
  } catch (err) {
    if (err.message === "Transaction not found!" || err.message === "User not found!") {
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

const getUserTransactionsController = async (req, res) => {
  try {
    const transactions = await getUserTransactionsService(req.params.id);
    return res.status(200).json({
      statusCode: 200,
      isSuccess: true,
      result: transactions,
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

export {
  createTransactionController,
  verifyTransactionController,
  getUserTransactionsController,
};
