import bcrypt from "bcrypt";
import Users from "../models/User.js";
import {
  sendProjectCreatedEmail,
  sendProjectOwnerInviteEmail,
} from "../utils/email-templates.js";
import { generateStrongPassword } from "./passwordGenerator.js";

export const inviteProjectDeveloper = async (data) => {
  const password = generateStrongPassword();
  const hashedPass = await bcrypt.hash(password, 10);
  const user = new Users({
    firstName: data.developerFirstName,
    lastName: data.developerLastName,
    phoneNumber: data.phoneNumber,
    email: data.email,
    role: "developer",
    profileModel: "DeveloperProfile",
    firstTime: true,
    password: hashedPass,
    verified: true,
  });

  try {
    const userExists = await Users.findOne({ email: user.email }).lean();
    if (userExists) {
      await sendProjectCreatedEmail(userExists, so, data);
      return userExists._id;
    }

    const newUser = await user.save();
    await sendProjectOwnerInviteEmail(newUser, password);
    /* Send notification to bell icon in client */

    return newUser._id;
  } catch (error) {
    console.log(error);
    return { data: null, error: true };
  }
};
