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
        <h2 style="color: white; margin: 0;">Carbon Markets Ledger</h2>
      </div>
      <div class="content" style="background-color: #ffffff">
        <p>Hello ${user.firstName},</p>
        <p>Welcome to Carbon Markets Ledger! We are excited to have you on board. To ensure a smooth experience and to fully access your account, kindly verify your email address by clicking the button below:</p>
        <p><a href="${verificationLink}" class="button" target="_blank" style="color: white">Verify My Email Address</a></p>
        <p>If the button above does not work, please copy and paste the following link into your browser:</p>
        <p><a href="${verificationLink}" target="_blank">${verificationLink}</a></p>
        <p>Once your email address is verified, you will be all set to explore and enjoy the features of Carbon Markets Ledger. If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:carbonmarketsledger@gmail.com">carbonmarketsledger@gmail.com</a>. Alternatively, you can visit our website at <a href="https://www.example.com" target="_blank">www.example.com</a> and chat with our helpful chatbot.</p>
        <p>Thank you for choosing Carbon Markets Ledger!</p>
        <p>The Carbon Markets Ledger Team.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Carbon Markets Ledger. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  const subject = "Complete Your Email Verification for Carbon Markets Ledger";
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
    <title>Welcome to Carbon Markets Ledger. Your account has been created.</title>
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
        <h2 style="color: white; margin: 0;">Carbon Markets Ledger</h2>
      </div>
      <div class="content" style="background-color: #ffffff">
        <p>Dear ${user.firstName},</p>
        <p>We're excited to inform you that a Carbon Markets Ledger account has been created for you.
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
        at carbonmarketsledger@gmail.com</p>
        <p>
        We're thrilled to have you on board and look forward to seeing you in the Carbon Markets Ledger community!
                </p>
        <p>Best Regards, </p>
        <p>The Carbon Markets Ledger Team.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Carbon Markets Ledger. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  const subject = `Welcome to Carbon Markets Ledger. Your account has been created.`;
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
    <title>Password Reset for your Carbon Markets Ledger Account. </title>
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
        <h2 style="color: white; margin: 0;">Carbon Markets Ledger</h2>
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
        at carbonmarketsledger@gmail.com</p>
        <p>
        Thank you for using Carbon Markets Ledger. We're committed to providing a secure and enjoyable experience for our users.                </p>
        <p>Best Regards, </p>
        <p>The Carbon Markets Ledger Team.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Carbon Markets Ledger. All rights reserved.</p>
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

export const sendProjectCreatedEmail = async (owner, registry, project) => {
  const emailBody = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the ${process.env.APP_NAME}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #000000; background-color: #333333; }
      p { color: black; font-size: 14px}
      .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
      .header { background-color: #3869d4; padding: 20px; text-align: center; }
      .content { padding: 20px; }
      .button { 
          border: 2px solid #3869d4; 
          background-color: transparent;
          color: #3869d4; 
          display: inline-block; 
          text-decoration: none; 
          padding: 10px 22px; 
          font-size: 16px; 
          border-radius: 4px; 
          text-align: center;
      }
      .footer { font-size: 12px; text-align: center; margin-top: 20px; }
    </style>
  </head>
  <body style="background-color: #f5f5f5">
    <div class="container">
      <div class="header">
        <h2 style="color: white; margin: 0;">${process.env.MAIL_FROM_NAME}</h2>
      </div>
      <div class="content">
        <p>Dear ${owner.firstName},</p>
        <p>We're excited to inform you that your project, ${
          project.name
        }, has been onboarded onto our platform by ${registry.name}.

        <p>You can now review your project and access our services to help enhance your experience.</p>
        <a href="${
          process.env.LOGIN_URL
        }" class="button" target="_blank">Login to Your Account</a>
        <p>If the button above does not work, use the following link:</p>
        <p><a href="${process.env.LOGIN_URL}" target="_blank">${
    process.env.LOGIN_URL
  }</a></p>
        <p>If you need assistance or have any questions, please visit our support page or contact our support team at ${
          process.env.MAIL_SUPPORT_ADDRESS
        }.</p>
        <p>We're thrilled to have you on board and look forward to seeing you in the ${
          process.env.APP_NAME
        } community!</p>
        <p>Best Regards, <br>The ${process.env.APP_NAME} Team</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${
    process.env.APP_NAME
  }. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  const subject = `Welcome to the ${process.env.APP_NAME}.`;
  const emailHeaders = {
    "Content-Type": "text/html",
    "Content-Disposition": "inline",
  };
  await sendEmail(owner.email, subject, emailBody, emailHeaders);
};

export const sendProjectOwnerInviteEmail = async (user, password) => {
  const emailBody = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the ${process.env.APP_NAME}.</title>
    <style>
      body { font-family: Arial, sans-serif; color: #000000; background-color: #333333; }
      p { color: black; font-size: 14px}
      .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
      .header { background-color: #3869d4; padding: 20px; text-align: center; }
      .content { padding: 20px; }
      .button { 
          border: 2px solid #3869d4; 
          background-color: transparent;
          color: #3869d4; 
          display: inline-block; 
          text-decoration: none; 
          padding: 10px 22px; 
          font-size: 16px; 
          border-radius: 4px; 
          text-align: center;
      }
      .footer { font-size: 12px; text-align: center; margin-top: 20px; }
    </style>
  </head>
  <body style="background-color: #f5f5f5">
    <div class="container">
      <div class="header">
        <h2 style="color: white; margin: 0;">${process.env.MAIL_FROM_NAME}</h2>
      </div>
      <div class="content">
        <p>Dear ${user.firstName},</p>
        <p>Congrats! Your project has been added to ${
          process.env.APP_NAME
        }. Login to your account with the link below and use the provided credentials.</p>
        <a href="${
          process.env.FRONTEND_BASE_URL
        }" class="button" target="_blank">Login to Your Account</a>
        <p>If the button above does not work, use the following link:</p>
        <p><a href="${process.env.LOGIN_URL}" target="_blank">${
    process.env.LOGIN_URL
  }</a></p>
        <p><strong>Email: </strong>${user.email}</p>
        <p><strong>Password: </strong>${password}</p>

        <p>If you need assistance or have any questions, please visit our support page or contact our support team at ${
          process.env.MAIL_SUPPORT_ADDRESS
        }.</p>
        <p>We're thrilled to have your project on board and look forward to a successful collaboration!</p>
        <p>Best Regards, <br>The ${process.env.APP_NAME} Team</p>
      </div>
    </div>
    <div class="footer">
    <p>&copy; ${new Date().getFullYear()} ${
    process.env.APP_NAME
  }. All rights reserved.</p>
  </div>
  </body>
  </html>`;

  const subject = `Welcome to the ${process.env.APP_NAME} Onboarding Process`;
  const emailHeaders = {
    "Content-Type": "text/html",
    "Content-Disposition": "inline",
  };
  await sendEmail(user.email, subject, emailBody, emailHeaders);
};
