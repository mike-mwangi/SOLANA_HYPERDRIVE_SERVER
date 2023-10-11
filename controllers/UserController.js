import User from "../models/User.js";
// import {
//   uploadToPrivateSpace,
//   uploadToPublicSpace,
// } from "../utils/storageManagementUtils.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("profile");
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, profileImage } = req.body;

    const profile = await User.findById(req.params.userId);

    if (!profile) {
      return res.status(404).json({ message: "User profile not found." });
    }
    // await uploadToPublicSpace(req, "profile");
    const fieldsToUpdate = [
      "firstName",
      "lastName",
      "phoneNumber",
      "profileImage",
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field]) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    res
      .status(200)
      .json({ message: "User profile updated successfully", profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
