import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        maxlength: 200,
    },
    status: {
        type: String,
        required: true,
        default: "basic",
        enum: ['free', 'paid']
    },
    phone: {
        type: String,
        required: true,
        default: mongoose.Types.ObjectId()
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    socialSignIn: {
        type: Boolean,
        default: false,
        required: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);