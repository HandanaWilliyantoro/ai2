import mongoose from "mongoose";

const Plugin = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        unique: true
    },
    creator: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true,
        unique: true
    },
  },
  { timestamps: true }
);

export default mongoose.models.Plugin ||
  mongoose.model("Plugin", Plugin);