import nodemailer from "nodemailer";

const sendEmail = async (email, subject, html, headers) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      // from: process.env.MAIL_FROM_ADDRESS,
      from: "X <" + process.env.MAIL_FROM_ADDRESS + ">",
      to: email,
      subject: subject,
      html: html,
      headers: headers,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent");
    console.log("MAIL_HOST", process.env.MAIL_HOST);
    console.log(error);
  }
};

export default sendEmail;
