import nodemailer from "nodemailer";

const GOOGLE_APP_EMAIL = Bun.env.GOOGLE_APP_EMAIL;
const GOOGLE_APP_PASSWORD = Bun.env.GOOGLE_APP_PASSWORD;
const NODEMAILER_TRANSPORTER_HOST = Bun.env.NODEMAILER_TRANSPORTER_HOST;
const NODEMAILER_TRANSPORTER_PORT = parseInt(
  Bun.env.NODEMAILER_TRANSPORTER_PORT
);

const initTransporter = () => {
  try {
    const transporter = nodemailer.createTransport({
      host: NODEMAILER_TRANSPORTER_HOST,
      port: NODEMAILER_TRANSPORTER_PORT,
      secure: false,
      auth: {
        user: GOOGLE_APP_EMAIL,
        pass: GOOGLE_APP_PASSWORD,
      },
    });
    return transporter;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const sendMail = async (to, subject, body) => {
  try {
    const mailOption = {
      from: GOOGLE_APP_EMAIL,
      to,
      subject,
      html: body,
    };
    const transporter = initTransporter();
    await transporter.sendMail(mailOption);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default sendMail;
