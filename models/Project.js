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

    minlength: 100,
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
    type: String,

    maxlength: 100,
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
  monitoringPlan: {
    type: S3ObjectSchema,
  },

  step: {
    type: Number,
    default: 1,
  },
  stage: {
    type: String,
    default: "Draft",
  },
  status: {
    type: String,
    default: "Pending Approval",
  },
});

export default mongoose.model("Project", ProjectSchema);
