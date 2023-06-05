import mongoose from "mongoose";

const Webhook = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
  },
  { timestamps: true }
);

export default mongoose.models.Webhook ||
  mongoose.model("Webhook", Webhook);