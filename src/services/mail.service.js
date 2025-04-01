import {
  sendVerificationMail,
  createResetPasswordHTML,
  createVerifyEmailHTML,
} from "../utils/mail.util";
import generateOTP from "../utils/otp.util";
import { storeRedisKey } from "../utils/redis.util";

const OTP_EXPIRY_TIME = parseInt(Bun.env.OTP_EXPIRY_TIME);

const sendMailResetPasswordService = async (email) => {
  try {
    const otpCode = generateOTP();
    const subject = "Reset Your Password";
    
    const userData = {
      email,
      otpCode: otpCode,
    };
    
    await storeRedisKey(
      `resetpassword:${email}`,
      userData,
      OTP_EXPIRY_TIME * 60
    );
    
    const htmlBody = createResetPasswordHTML(email, otpCode, OTP_EXPIRY_TIME);
    
    await sendVerificationMail(email, subject, htmlBody);
  } catch (err) {
    throw err;
  }
};

const sendVerificationEmailService = async (name, email, password) => {
  try {
    const otpCode = generateOTP();
    const subject = "Verify Your Email";
    
    const userDataToStore = {
      name,
      email,
      password,
      otpCode: otpCode,
    };
    
    await storeRedisKey(
      `registration:${email}`,
      userDataToStore,
      OTP_EXPIRY_TIME * 60
    );
    
    const htmlBody = createVerifyEmailHTML(email, otpCode, OTP_EXPIRY_TIME);
    
    await sendVerificationMail(email, subject, htmlBody);
  } catch (err) {
    throw err;
  }
};

export { sendMailResetPasswordService, sendVerificationEmailService };