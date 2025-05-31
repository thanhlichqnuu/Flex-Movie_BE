import payos from "../config/payos.config";

const PAYOS_RETURN_URL = Bun.env.PAYOS_RETURN_URL;
const PAYOS_CANCEL_URL = Bun.env.PAYOS_CANCEL_URL;
const PAYOS_EXPIRED_TIME = Bun.env.PAYOS_EXPIRED_TIME;

const createPaymentLink = async (orderCode, amount, description) => {
  const payload = {
    orderCode,
    amount,
    description,
    cancelUrl: PAYOS_CANCEL_URL,
    returnUrl: PAYOS_RETURN_URL,
    expiredAt: Math.floor(Date.now() / 1000) + Number(PAYOS_EXPIRED_TIME),
  };
  try {
    const res = await payos.createPaymentLink(payload);
    return res;
  } catch (err) {
    throw err;
  }
};

const verifyPayment = async (orderCode) => {
  try {
    const res = await payos.getPaymentLinkInformation(orderCode);
    return res;
  } catch (err) {
    throw err;
  }
};

export { createPaymentLink, verifyPayment };
