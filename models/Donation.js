import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        enum: ['USD', 'IDR']
    },
    amount: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    donationId: {
        type: String,
        unique: true
    },
    image: {
        type: String,
        required: false
    }
  },
  { timestamps: true }
);

export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);