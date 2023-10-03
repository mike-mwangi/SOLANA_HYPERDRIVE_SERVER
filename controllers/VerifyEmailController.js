import User from "../models/User.js";
import Token from "../models/Token.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email-templates.js";

export const verifyEmail = async (req, res) => {
  try {
    console.log("Verifying email with params:", req.params);
    const user = await User.findOne({ _id: req.params.id });

    console.log("Found user", user);

    if (!user) return res.status(400).send("User does not exist");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    console.log("Found token:", token);

    if (!token) {
      if (user.verified) {
        return res.send(`
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: red;">Invalid Link!</h2>
          <p style="margin: 20px 0;">This link has been already used. You can login to your account.</p>
          <a href="${process.env.FRONTEND_BASE_URL}/login" style="display: inline-block; padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Login</a>
        </div>
      `);
      } else {
        return res.send(`
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: red;">Expired Link!</h2>
          <p style="margin: 20px 0;">This verification link has expired. Please request a new one.</p>
          <a href="${process.env.FRONTEND_BASE_URL}/verify-email" style="display: inline-block; padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Request new link</a>
        </div>
      `);
      }
    }

    await User.findOneAndUpdate(
      { _id: user._id },
      { verified: true },
      { useFindAndModify: false }
    );
    try {
      await Token.findByIdAndRemove(token._id);
    } catch (error) {
      console.error("Error removing token:", error);
    }
    return res.send(`
      <div style="padding: 20px; text-align: center;">
        <h2 style="color: green;">Email verified successfully!</h2>
        <p style="margin: 20px 0;">You can now login to your account.</p>
        <a href="${process.env.FRONTEND_BASE_URL}/login" style="display: inline-block; padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Login</a>
      </div>
    `);
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(400).json({ error: error.message });
  }
};

export const resendVerificationLink = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({
      msg: "No such user. Kindly check your email and try again.",
    });

  // Remove any existing tokens for the user
  await Token.deleteMany({ userId: user._id });

  let token = await new Token({
    userId: user._id,
    role: user?.role,
    token: crypto.randomBytes(20).toString("hex"),
  }).save();

  try {
    await sendVerificationEmail(user, token);

    res.status(200).json({
      message: "An Email has been sent to your account please verify",
      user: user,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
