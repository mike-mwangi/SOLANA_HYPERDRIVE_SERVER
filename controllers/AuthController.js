import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Token from "../models/Token.js";
import sendEmail from "../utils/email.js";
import {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} from "../utils/email-templates.js";
import crypto from "crypto";
import PasswordHistory from "../models/PasswordHistory.js";

/* REGISTER USER */
const SALT_ROUNDS = 10;
function getProfileModel(role) {
  switch (role) {
    case "registry":
      return "RegistryProfile";
    default:
      return "";
  }
}

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, role, password, country } =
      req.body;

    let user = await User.findOne({ email });
    if (user)
      return res.status(400).send("User with given email already exist!");

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        msg: "Password should be more than 8 characters",
      });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      country,
      password: passwordHash,
      profileModel: getProfileModel(role),
    });
    const savedUser = await newUser.save();

    const token = await new Token({
      userId: savedUser._id,
      role: savedUser.role,
      token: crypto.randomBytes(20).toString("hex"),
    }).save();

    await sendVerificationEmail(savedUser, token);

    res.status(201).json({
      message: "An Email has been sent to your account please verify",
      user: savedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).json({
        msg: "Incorrect credetials. Check username and password and try again. ",
      });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
    if (user.verified != true) {
      return res.status(403).json({ msg: "Email not verified!" });
    }
    const roles = user.role;
    if (user.role == "vvb" && user.isPasswordChanged != true) {
      return res.status(403).json({
        msg: "You need to change your password! Click on Forgot Password.",
      });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "1h" }
    );
    delete user.password;
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "1d" }
    );
    const newToken = new Token({ userId: user._id, token: refreshToken });
    await newToken.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ token, user, roles });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* REFRESH TOKEN */
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.sendStatus(403); // Forbidden
    }

    const tokenInDB = await Token.findOne({
      userId: user._id,
      token: refreshToken,
    });
    if (!tokenInDB) {
      return res.sendStatus(403); // Forbidden
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "1h" }
    );
    res.json({ accessToken });
  } catch (err) {
    res.sendStatus(403); // Forbidden
  }
};

/* LOGOUT */
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.clearCookie("refreshToken");
      res.sendStatus(200);
      return;
    }

    const tokenInDB = await Token.findOneAndRemove({ token: refreshToken });

    if (!tokenInDB) {
      res.clearCookie("refreshToken");
      res.sendStatus(200);
      return;
    }

    res.clearCookie("refreshToken");
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in logout:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* FORGOT PASSWORD */
export const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, error: "There is no user with that email" });
  }

  const resetToken = user.generatePasswordResetToken();
  const resetUrl = `${process.env.FRONTEND_BASE_URL}/resetPassword/${resetToken}`;

  try {
    await sendForgotPasswordEmail(user, resetUrl);
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
    console.log(error);
    user.generatePasswordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return next(new ErrorResponse("Email could not be sent", 500));
  }
};

/* RESET PASSWORD */
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid password" });
    }
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");
    const passwordResetToken = resetPasswordToken;
    const time = Date.now(); // output in milliseconds so conversion is necessary to the date formart.
    const date = new Date(time);
    const isoString = date.toISOString();
    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: isoString },
    });

    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid token" });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, salt);
    const passwordHistory = await PasswordHistory.findOne({ userId: user._id });
    let isReusingPassword = false;
    if (passwordHistory) {
      for (let i = 0; i < passwordHistory.passwords.length; i++) {
        const pass = passwordHistory.passwords[i];
        const isMatch = await bcrypt.compare(password, pass);
        if (isMatch) {
          isReusingPassword = true;
          break;
        }
      }
    }
    if (isReusingPassword === true) {
      throw new Error("You cannot reuse a password");
    }
    await addPasswordToHistory(user._id, passwordHash);
    user.password = passwordHash;
    user.isPasswordChanged = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return res
      .status(200)
      .json({ success: true, data: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

async function addPasswordToHistory(userId, encryptedPassword) {
  let passwordHistory = await PasswordHistory.findOne({ userId });

  if (!passwordHistory) {
    // If the user doesn't have a password history yet, create a new one
    passwordHistory = await PasswordHistory.create({ userId, passwords: [] });
  }
  // Add the new password to the beginning of the array
  const now = new Date();
  passwordHistory.passwords.unshift(encryptedPassword);
  passwordHistory.passwords = passwordHistory.passwords.slice(0, 3);
  await passwordHistory.save();
}

/* CHANGE PASSWORD FROM ACCOUNT SETTINGS*/
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check for missing passwords in the request body
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Current and new passwords are required" });
    }

    const user = await User.findById(req.UserId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Incorrect current password" });

    // Check if new password is the same as the current password
    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({
        msg: "New password cannot be the same as the current password",
      });
    }

    // Validate new password length
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ msg: "Password should be at least 8 characters long" });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    user.password = passwordHash;
    await user.save();

    res.status(200).json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
