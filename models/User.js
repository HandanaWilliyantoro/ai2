import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false,
        unique: true
    },
    phone: {
        type: String,
        required: false,
        unique: true,
    },
    saved_token_id: {
        type: String,
        required: false
    },
    saved_token_id_expired_at: {
        type: String || Date,
        required: false,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false,
        enum: ["admin", "superadmin", "user"],
        default: 'user'
    },
    premium: {
        type: Boolean,
        required: true,
        default: false
    },
    planExpiry: {
        type: Number,
        required: false,
    }
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);