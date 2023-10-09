import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "This field is required"],
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: [true, "This field is required"],
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: [true, "This field is required"],
      max: 50,
      unique: [true, "This email is already in use!"],
    },
    phoneNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: ["registry", "admin", "proponent"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    iskyc: {
      type: Boolean,
      default: false,
    },
    isPasswordChanged: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    country: {
      type: String,
      required: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

UserSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 3600000; // token expires in 1 hour
  this.save();
  return token;
};

const User = mongoose.model("User", UserSchema);
export default User;
