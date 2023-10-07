import mongoose from "mongoose";
const Schema = mongoose.Schema;

const S3ObjectSchema = new Schema({
    bucket: {
      type: String,
    },
    key: {
      type: String,
    },
    url: {
      type: String,
    },
    name: {
      type: String,
    },
    status: {
      type: String,
      default: "uploading",
    },
  });

  export default S3ObjectSchema;
