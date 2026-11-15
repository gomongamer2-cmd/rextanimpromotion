import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    clientName: { type: String, required: true },
    phone: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Tournament App Promotion",
        "WhatsApp Channel Promotion",
        "WhatsApp Group Promotion",
      ],
      required: true,
    },
    videoCount: { type: Number, required: true, min: 1, max: 10 },
    totalPrice: { type: Number, required: true },
    bioLinkDays: { type: Number, required: true },
    selectedDate: { type: String, required: true },
    selectedTimeSlot: { type: String, required: true },
    orgLogoLink: { type: String, default: "" },
    tournamentDetails: { type: String, required: true },
    kycVerificationLink: { type: String, default: "" },
    paymentMethod: { type: String, default: "bKash Personal" },
    trxId: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
