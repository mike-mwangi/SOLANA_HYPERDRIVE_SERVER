import sendEmail from "../utils/email.js";

export const sendVerificationEmail = async (user, token) => {
  console.log(`Sending verification email to: ${process.env.BASE_URL}`);
  const verificationLink = `${process.env.BASE_URL}/auth/user/verify/${user.id}/${token.token}`;
  const emailBody = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      body { font-family: Arial, sans-serif; color: #000000; background-color: #333333; }
      p { color: black; }
      .container { width: 100%; max-width: 600px; margin: 0 auto; }
      .header { background-color: #28a745; padding: 20px; }
      .content { padding: 20px; }
      .button { background-color: #28a745; color: white; display: inline-block; text-decoration: none; padding: 12px 24px; font-size: 16px; border-radius: 4px; }
      .footer { font-size: 12px; text-align: center; margin-top: 20px; }
    </style>
  </head>
  <body style="background-color: #f5f5f5">
    <div class="container">
      <div class="header">
        <h2 style="color: white; margin: 0;">X</h2>
      </div>
      <div class="content" style="background-color: #ffffff">
        <p>Hello ${user.firstName},</p>
        <p>Welcome to X! We are excited to have you on board. To ensure a smooth experience and to fully access your account, kindly verify your email address by clicking the button below:</p>
        <p><a href="${verificationLink}" class="button" target="_blank" style="color: white">Verify My Email Address</a></p>
        <p>If the button above does not work, please copy and paste the following link into your browser:</p>
        <p><a href="${verificationLink}" target="_blank">${verificationLink}</a></p>
        <p>Once your email address is verified, you will be all set to explore and enjoy the features of X. If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:info@jahmike.sol">info@jahmike.sol</a>. Alternatively, you can visit our website at <a href="https://www.example.com" target="_blank">www.example.com</a> and chat with our helpful chatbot.</p>
        <p>Thank you for choosing X!</p>
        <p>The X Team.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} X. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  const subject = "Complete Your Email Verification for X";
  const emailHeaders = {
    "Content-Type": "text/html",
    "Content-Disposition": "inline",
  };
  await sendEmail(user.email, subject, emailBody, emailHeaders);
};


export const sendAccountCreationEmail = async (user, password) => {
  const emailBody = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to X. Your account has been created.</title>
    <style>
      body { font-family: Arial, sans-serif; color: #000000; background-color: #333333; }
      p { color: black; }
      .container { width: 100%; max-width: 600px; margin: 0 auto; }
      .header { background-color: #28a745; padding: 20px; }
      .content { padding: 20px; }
      .button { background-color: #28a745; color: white; display: inline-block; text-decoration: none; padding: 12px 24px; font-size: 16px; border-radius: 4px; }
      .footer { font-size: 12px; text-align: center; margin-top: 20px; }
    </style>
  </head>
  <body style="background-color: #f5f5f5">
    <div class="container">
      <div class="header">
        <h2 style="color: white; margin: 0;">X</h2>
      </div>
      <div class="content" style="background-color: #ffffff">
        <p>Dear ${user.firstName},</p>
        <p>We're excited to inform you that a X account has been created for you.
         With this account, you'll be able to access our services and 
        features to help enhance your experience.</p>
        <p>
        To login into your account use the following credentials:
        </p>
        <p>
        Email: <span>${user.email}</span>
        </p>
        <p>
        Password: <span>${password}</span>
        </p>
        <p>
        Click here to login 
        <a href=${process.env.FRONTEND_BASE_URL}/> ${
    process.env.FRONTEND_BASE_URL
  } </a>
        </p>
        <p>
        If you need assistance or have any questions, please visit our support page or contact our support team 
        at info@jahmike.sol</p>
        <p>
        We're thrilled to have you on board and look forward to seeing you in the X community!
                </p>
        <p>Best Regards, </p>
        <p>The X Team.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} X. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  const subject = `Welcome to X. Your account has been created.`;
  const emailHeaders = {
    "Content-Type": "text/html",
    "Content-Disposition": "inline",
  };
  await sendEmail(user.email, subject, emailBody, emailHeaders);
};

export const sendForgotPasswordEmail = async (user, resetUrl) => {
  const emailBody = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset for your X Account. </title>
    <style>
      body { font-family: Arial, sans-serif; color: #000000; background-color: #333333; }
      p { color: black; }
      .container { width: 100%; max-width: 600px; margin: 0 auto; }
      .header { background-color: #28a745; padding: 20px; }
      .content { padding: 20px; }
      .button { background-color: #28a745; color: white; display: inline-block; text-decoration: none; padding: 12px 24px; font-size: 16px; border-radius: 4px; }
      .footer { font-size: 12px; text-align: center; margin-top: 20px; }
    </style>
  </head>
  <body style="background-color: #f5f5f5">
    <div class="container">
      <div class="header">
        <h2 style="color: white; margin: 0;">X</h2>
      </div>
      <div class="content" style="background-color: #ffffff">
        <p>Dear ${user.firstName},</p>
        <p>We received a request to reset the password for your email account associated with this email address. 
        If you did not make this request, please ignore this email. If you need to reset your password, 
        please follow the steps below:</p>
        <p>
        Click the link below to reset your password:
                </p>
      
        <p><a href="${resetUrl}" class="button" target="_blank" style="color: white">Change Password</a></p>
        <p>If the button above does not work, please copy and paste the following link into your browser:</p>
        <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
        <p>
        If you need assistance or have any questions, please visit our support page or contact our support team 
        at info@jahmike.sol</p>
        <p>
        Thank you for using X. We're committed to providing a secure and enjoyable experience for our users.                </p>
        <p>Best Regards, </p>
        <p>The X Team.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} X. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  const subject = `Reset Your Password`;
  const emailHeaders = {
    "Content-Type": "text/html",
    "Content-Disposition": "inline",
  };
  await sendEmail(user.email, subject, emailBody, emailHeaders);
};

