import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    orderId: { type: String, default: null },
  },
  { timestamps: true }
);

SlotSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

export default mongoose.models.Slot || mongoose.model("Slot", SlotSchema);
