import mongoose from "mongoose";

const ActiveDateSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
    note: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.ActiveDate || mongoose.model("ActiveDate", ActiveDateSchema);
