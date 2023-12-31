import mongoose from "mongoose";
import S3ObjectSchema from "./S3ObjectSchema.js";

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  registry: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,

    maxlength: 100,
  },
  type: {
    type: String,
  },
  description: {
    type: String,
    maxlength: 2000,
  },
  location: {
    type: String,
  },
  verificationStandard: {
    type: String,
  },
  verificationStatus: {
    type: String,
  },
  verificationDocument: {
    type: S3ObjectSchema,
  },
  totalCreditsIssued: {
    type: Number,

    min: 0,
  },
  creditIssuanceDate: {
    type: Date,
  },
  developer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  developerFirstName: {
    type: String,
  },
  developerLastName: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  website: {
    type: String,
  },
  images: {
    type: [S3ObjectSchema],
  },
  additionalDocuments: {
    type: [S3ObjectSchema],
  },
  complianceMechanism: {
    type: String,

    minlength: 50,
    maxlength: 1000,
  },

  step: {
    type: Number,
    default: 1,
  },
  stage: {
    type: String,
    default: "draft",
  },
  status: {
    type: String,
    default: "Pending Approval",
  },
});

export default mongoose.model("Project", ProjectSchema);
