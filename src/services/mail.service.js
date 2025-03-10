import Users from "../models/users.model";
import sendMail from "../utils/mail.util";
import { createResetPasswordHTML, createVerifyEmailHTML } from "../utils/emailTemplate.util";
import { generateResetPasswordToken } from "./token.service";
import generateOTP from "../utils/otp.util";
import { storeRedisKey } from "../utils/redis.util";

const RESET_TOKEN_TTL = parseInt(Bun.env.RESET_TOKEN_TTL);
const OTP_EXPIRY_TIME = parseInt(Bun.env.OTP_EXPIRY_TIME);

const sendMailResetPasswordService = async (userData) => {
  const { email } = userData;

  try {
    const existedUser = await Users.findOne({
      where: { email },
    });
    if (!existedUser) {
      throw new Error("User not found!");
    }

    const resetPasswordToken = await generateResetPasswordToken(existedUser);
    const subject = "Reset your password - Flex Movie";
    const resetPasswordURL = `http://localhost:3000/reset-password?id=${existedUser.id}&token=${resetPasswordToken}`;
    const expiryTime = RESET_TOKEN_TTL / 60;

    const htmlBody = createResetPasswordHTML(
      email,
      resetPasswordURL,
      expiryTime
    );
    await sendMail(email, subject, htmlBody);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const sendVerificationEmailService = async (name, email, password) => {
  try {
    const otpCode = generateOTP();
    const subject = "Verify Your Email - Flex Movie";

    const userDataToStore = { 
      name, 
      email,
      password, 
      otpCode: otpCode
    };
    
    await storeRedisKey(`registration:${email}`, userDataToStore, OTP_EXPIRY_TIME * 60);
    
    const htmlBody = createVerifyEmailHTML(
      email,
      otpCode,
      OTP_EXPIRY_TIME
    );
    
    await sendMail(email, subject, htmlBody);
  } catch (err) {
    console.error(err);
    throw err;
  }
};


export { sendMailResetPasswordService, sendVerificationEmailService };
