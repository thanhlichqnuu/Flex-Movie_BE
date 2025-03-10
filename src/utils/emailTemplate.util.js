const resetPasswordHTMLTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Flex Movie</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: rgb(252, 252, 252);
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: rgb(252, 252, 252);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #007bff;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      margin-bottom: 15px;
    }
    .resetPasswordBtn {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    .resetPasswordBtn:hover {
      background-color: #0056b3;
    }
    footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
    .highlight {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Password</h1>
    <p>Hi <span class="highlight">{{userEmail}}</span>,</p>
    <p>We received a request to reset your password for your Flex Movie account.</p>
    <p>
      <a href="{{resetLink}}" class="resetPasswordBtn">Reset Password</a>
    </p>
    <p>This link will expire in <span class="highlight">{{expiryTime}} minute</span>.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Thanks,<br>The Flex Movie Team</p>
    <footer>
      <p>This email was sent to you because you requested a password reset on Flex Movie. Please do not reply to this email.</p>
    </footer>
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
  <title>Verify Your Email - Flex Movie</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: rgb(252, 252, 252);
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: rgb(252, 252, 252);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h1 {
      color: #007bff;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      margin-bottom: 15px;
    }
    .otp-code {
      display: inline-block;
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      background-color: #f0f8ff;
      padding: 10px 20px;
      border-radius: 5px;
      letter-spacing: 5px;
    }
    footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Verify Your Email</h1>
    <p>Hi <span class="highlight">{{userEmail}}</span>,</p>
    <p>Thank you for signing up for Flex Movie! To complete your registration, please use the verification code below:</p>
    <p class="otp-code">{{otpCode}}</p>
    <p>This code will expire in <span class="highlight">{{expiryTime}} minutes</span>.</p>
    <p>If you did not request this verification, please ignore this email.</p>
    <p>Thanks,<br>The Flex Movie Team</p>
    <footer>
      <p>This email was sent to you because you registered on Flex Movie. Please do not reply to this email.</p>
    </footer>
  </div>
</body>
</html>
`;

const createVerifyEmailHTML = (userEmailTo, otpCode, expiryTime) => {
  return verifyEmailHTMLTemplate
    .replace('{{userEmail}}', userEmailTo)
    .replace('{{otpCode}}', otpCode)
    .replace('{{expiryTime}}', expiryTime);
};

const createResetPasswordHTML = (userEmailTo, resetLink, expiryTime) => {
  return resetPasswordHTMLTemplate
    .replace('{{userEmail}}', userEmailTo)
    .replace('{{resetLink}}', resetLink)
    .replace('{{expiryTime}}', expiryTime);
};

export { createVerifyEmailHTML, createResetPasswordHTML }
