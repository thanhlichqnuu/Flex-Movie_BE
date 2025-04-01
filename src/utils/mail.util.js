import initTransporter from "../config/nodemailer.config";

const GOOGLE_APP_EMAIL = Bun.env.GOOGLE_APP_EMAIL;

const resetPasswordHTMLTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="otp" content="{{otpCode}}">
    <meta name="one-time-code" content="{{otpCode}}">
    <title>Verification Code: {{otpCode}} - Reset Password Flex Movie</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            text-align: center;
        }
        .logo {
            margin-bottom: 25px;
        }
        h1 {
            color: #2563eb;
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 25px;
            letter-spacing: -0.025em;
        }
        p {
            margin-bottom: 16px;
            color: #4b5563;
            font-size: 16px;
        }
        .otp-container {
            margin: 30px 0;
        }
        .otp-text {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #374151;
        }
        .otp-code {
            display: inline-block;
            font-size: 32px;
            font-weight: 700;
            color: #2563eb;
            background-color: #eff6ff;
            padding: 16px 28px;
            border-radius: 8px;
            letter-spacing: 8px;
            border: 1px solid #dbeafe;
        }
        .otp-format {
            font-size: 16px;
            margin-top: 12px;
            color: #6b7280;
        }
        .expiry {
            font-weight: 600;
            color: #dc2626;
        }
        .footer {
            margin-top: 40px;
            font-size: 13px;
            color: #6b7280;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <!-- If you have a logo, uncomment this -->
            <!-- <img src="logo.png" alt="Flex Movie" width="120"> -->
            <h1>Flex Movie</h1>
        </div>
        
        <h1>Reset Your Password</h1>
        
        <p>Hello <strong>{{userEmail}}</strong>,</p>
        
        <p>You've requested to reset your password for your Flex Movie account. Please use the verification code below to complete this process.</p>
        
        <div class="otp-container">
            <div class="otp-text">Your verification code:</div>
            <div class="otp-code">{{otpCode}}</div>
            <div class="otp-format">@FlexMovie #{{otpCode}}</div>
        </div>
        
        <p>This code will expire in <span class="expiry">{{expiryTime}} minutes</span>.</p>
        
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        
        <p>Best regards,<br>The Flex Movie Team</p>
        
        <div class="footer">
            <p>This email was sent to you because you requested a password reset on Flex Movie.<br>
            Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;

const verifyEmailHTMLTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="otp" content="{{otpCode}}">
    <meta name="one-time-code" content="{{otpCode}}">
    <title>Verification Code: {{otpCode}} - Verify Email Flex Movie</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            text-align: center;
        }
        .logo {
            margin-bottom: 25px;
        }
        h1 {
            color: #2563eb;
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 25px;
            letter-spacing: -0.025em;
        }
        p {
            margin-bottom: 16px;
            color: #4b5563;
            font-size: 16px;
        }
        .otp-container {
            margin: 30px 0;
        }
        .otp-text {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #374151;
        }
        .otp-code {
            display: inline-block;
            font-size: 32px;
            font-weight: 700;
            color: #2563eb;
            background-color: #eff6ff;
            padding: 16px 28px;
            border-radius: 8px;
            letter-spacing: 8px;
            border: 1px solid #dbeafe;
        }
        .otp-format {
            font-size: 16px;
            margin-top: 12px;
            color: #6b7280;
        }
        .expiry {
            font-weight: 600;
            color: #dc2626;
        }
        .footer {
            margin-top: 40px;
            font-size: 13px;
            color: #6b7280;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <!-- If you have a logo, uncomment this -->
            <!-- <img src="logo.png" alt="Flex Movie" width="120"> -->
            <h1>Flex Movie</h1>
        </div>
        
        <h1>Verify Your Email</h1>
        
        <p>Hello <strong>{{userEmail}}</strong>,</p>
        
        <p>Thank you for signing up for Flex Movie! To complete your registration and activate your account, please use the verification code below.</p>
        
        <div class="otp-container">
            <div class="otp-text">Your verification code:</div>
            <div class="otp-code">{{otpCode}}</div>
            <div class="otp-format">@FlexMovie #{{otpCode}}</div>
        </div>
        
        <p>This code will expire in <span class="expiry">{{expiryTime}} minutes</span>.</p>
        
        <p>If you didn't create an account with us, please ignore this email.</p>
        
        <p>Welcome aboard!<br>The Flex Movie Team</p>
        
        <div class="footer">
            <p>This email was sent to you because you registered on Flex Movie.<br>
            Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;

const createVerifyEmailHTML = (userEmailTo, otpCode, expiryTime) => {
  return verifyEmailHTMLTemplate
    .replace(/{{userEmail}}/g, userEmailTo)
    .replace(/{{otpCode}}/g, otpCode)
    .replace(/{{expiryTime}}/g, expiryTime);
};

const createResetPasswordHTML = (userEmailTo, otpCode, expiryTime) => {
  return resetPasswordHTMLTemplate
    .replace(/{{userEmail}}/g, userEmailTo)
    .replace(/{{otpCode}}/g, otpCode)
    .replace(/{{expiryTime}}/g, expiryTime);
};

const sendVerificationMail = async (to, subject, body) => {
  try {
    const otpSubject = `${subject} - Flex Movie`;
    const mailOption = {
      from: GOOGLE_APP_EMAIL,
      to,
      subject: otpSubject,
      html: body,
    };
    const transporter = initTransporter();
    await transporter.sendMail(mailOption);
  } catch (err) {
    throw err;
  }
};

export { sendVerificationMail, createVerifyEmailHTML, createResetPasswordHTML };