import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 3600, // expire the token after one hour
  },
});

const Token = mongoose.model("Token", TokenSchema);
export default Token;
