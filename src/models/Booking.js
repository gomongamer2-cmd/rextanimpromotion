import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    clientName: { type: String, required: true },
    phone: { type: String, required: true },
    category: {
      type: String,
      required: true,
    },
    videoCount: { type: Number, required: true, min: 1, max: 10 },
    totalPrice: { type: Number, required: true },
    bioLinkDays: { type: Number, default: 1 },
    selectedDate: { type: String, required: true },
    selectedTimeSlot: { type: String, default: "Official Day" },
    orgLogoLink: { type: String, default: "" },
    orgLogoUrl: { type: String, default: "" },
    orgLogoId: { type: String, default: "" },
    orgBannerUrl: { type: String, default: "" },
    orgBannerId: { type: String, default: "" },
    nidCertificateUrl: { type: String, default: "" },
    nidCertificateId: { type: String, default: "" },
    driveFolderUrl: { type: String, default: "" },
    driveFolderId: { type: String, default: "" },
    tournamentDetails: { type: String, default: "Not specified" },
    kycVerificationLink: { type: String, default: "" },
    paymentMethod: { type: String, default: "bKash Personal" },
    trxId: { type: String, required: true },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
