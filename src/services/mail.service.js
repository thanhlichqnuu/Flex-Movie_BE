import Users from "../models/users.model";
import sendMail from "../utils/mail.util";
import { createResetPasswordHTML, createVerifyEmailHTML } from "../utils/emailTemplate.util";
import { generateResetPasswordToken } from "./token.service";

const RESET_TOKEN_TTL = parseInt(Bun.env.RESET_TOKEN_TTL);

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

export { sendMailResetPasswordService };
