import mongoose from "mongoose";

const ArtSubscriptionSchema = new mongoose.Schema(
  {
    transaction_name: {
        type: String,
        required: false
    },
    payment_type: {
        type: String,
        required: false,
    },
    channel_response_message: {
        type: String,
        required: false,
    },
    saved_token_id: {
        type: String,
        required: false
    },
    saved_token_id_expired_at: {
        type: String || Date,
        required: false,
    },
    user_email: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: false
    },
  },
  { timestamps: true }
);

export default mongoose.models.ArtSubscription ||
  mongoose.model("ArtSubscription", ArtSubscriptionSchema);