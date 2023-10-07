import mongoose from "mongoose";
import S3ObjectSchema from "./S3ObjectSchema.js";
const Schema = mongoose.Schema;

const RegistrySchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  jurisdiction: {
    type: String,
  },
  contactName: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
  certificateOfIncorporation: {
    type: S3ObjectSchema,
  },
  step: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    default: "draft",
  },
});

const Registry = mongoose.model("Registry", RegistrySchema);
export default Registry;
