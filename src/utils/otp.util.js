import crypto from 'crypto';

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 1000000);
  return otp;
}

export default generateOTP;