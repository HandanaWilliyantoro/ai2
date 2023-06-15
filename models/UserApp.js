import mongoose from "mongoose";

const UserApp = new mongoose.Schema(
  {
    user_email: {
        type: String,
        required: true
    },
    app_name: {
        type: String,
        required: true
    },
    app_url: {
        type: String,
        required: true
    },
    app_type: {
        type: String,
        required: true,
        enum: ['plugin', 'app']
    },
    app_desc: {
        type: String,
        required: true
    },
  },
  { timestamps: true }
);

export default mongoose.models.UserApp ||
  mongoose.model("UserApp", UserApp);