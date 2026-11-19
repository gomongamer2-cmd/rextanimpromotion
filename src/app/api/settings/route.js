import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Setting from "../../../models/Setting";
import { verifySessionToken } from "../../../lib/auth";

export const dynamic = "force-dynamic";

let fallbackSettings = {
  bkashNumber: "01611657757",
  nagadNumber: "01611657757",
  rocketNumber: "01611657757",
  whatsappNumber: "8801611657757",
};

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      let config = await Setting.findOne({ key: "global_config" });
      if (!config) {
        config = await Setting.create({ key: "global_config", ...fallbackSettings });
      }
      return NextResponse.json({
        success: true,
        settings: {
          bkashNumber: config.bkashNumber || fallbackSettings.bkashNumber,
          nagadNumber: config.nagadNumber || fallbackSettings.nagadNumber,
          rocketNumber: config.rocketNumber || fallbackSettings.rocketNumber,
          whatsappNumber: config.whatsappNumber || fallbackSettings.whatsappNumber,
        },
      });
    }

    return NextResponse.json({ success: true, settings: fallbackSettings });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ success: true, settings: fallbackSettings });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get("mex_admin_token")?.value;
    if (!verifySessionToken(token)) {
      return NextResponse.json(
        { success: false, error: "অননুমোদিত অ্যাক্সেস। প্রথমে লগইন করুন।" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bkashNumber, nagadNumber, rocketNumber, whatsappNumber } = body;

    const db = await connectDB();
    if (db) {
      let config = await Setting.findOne({ key: "global_config" });
      if (!config) {
        config = new Setting({ key: "global_config" });
      }
      if (bkashNumber !== undefined) config.bkashNumber = bkashNumber.trim();
      if (nagadNumber !== undefined) config.nagadNumber = nagadNumber.trim();
      if (rocketNumber !== undefined) config.rocketNumber = rocketNumber.trim();
      if (whatsappNumber !== undefined) config.whatsappNumber = whatsappNumber.trim();
      await config.save();

      return NextResponse.json({
        success: true,
        message: "পেমেন্ট ও হোয়াটসঅ্যাপ সেটিংস সফলভাবে আপডেট হয়েছে!",
        settings: config,
      });
    }

    // In-memory fallback
    if (bkashNumber !== undefined) fallbackSettings.bkashNumber = bkashNumber.trim();
    if (nagadNumber !== undefined) fallbackSettings.nagadNumber = nagadNumber.trim();
    if (rocketNumber !== undefined) fallbackSettings.rocketNumber = rocketNumber.trim();
    if (whatsappNumber !== undefined) fallbackSettings.whatsappNumber = whatsappNumber.trim();

    return NextResponse.json({
      success: true,
      message: "পেমেন্ট ও হোয়াটসঅ্যাপ সেটিংস সফলভাবে আপডেট হয়েছে!",
      settings: fallbackSettings,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
