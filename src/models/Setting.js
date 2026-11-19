import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "global_config" },
    bkashNumber: { type: String, default: "01611657757" },
    nagadNumber: { type: String, default: "01611657757" },
    rocketNumber: { type: String, default: "01611657757" },
    whatsappNumber: { type: String, default: "8801611657757" },
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
