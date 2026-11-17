import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import ActiveDate from "../../../models/ActiveDate";
import { verifySessionToken } from "../../../lib/auth";

export const dynamic = "force-dynamic";

// In-memory fallback if MONGODB_URI is not set
let fallbackDates = [
  { date: "2026-11-20", note: "টুর্নামেন্ট স্পেশাল ডে", isActive: true },
  { date: "2026-11-22", note: "সপ্তাহান্তিক প্রমোশন", isActive: true },
  { date: "2026-11-25", note: "মেগা টুর্নামেন্ট স্লট", isActive: true },
];

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const count = await ActiveDate.countDocuments();
      if (count === 0) {
        await ActiveDate.insertMany(fallbackDates);
      }
      const dates = await ActiveDate.find({ isActive: true }).sort({ date: 1 });
      return NextResponse.json({ success: true, dates });
    }

    return NextResponse.json({ success: true, dates: fallbackDates });
  } catch (error) {
    console.error("Fetch dates error:", error);
    return NextResponse.json({ success: true, dates: fallbackDates });
  }
}

export async function POST(req) {
  try {
    // Verify admin authentication
    const token = req.cookies.get("mex_admin_token")?.value;
    if (!verifySessionToken(token)) {
      return NextResponse.json(
        { success: false, error: "অননুমোদিত অ্যাক্সেস। প্রথমে লগইন করুন।" },
        { status: 401 }
      );
    }

    const { date, note } = await req.json();

    if (!date) {
      return NextResponse.json(
        { success: false, error: "Date is required" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    if (db) {
      const existing = await ActiveDate.findOne({ date });
      if (existing) {
        existing.isActive = true;
        if (note !== undefined) existing.note = note;
        await existing.save();
        return NextResponse.json({ success: true, date: existing });
      }

      const newDate = await ActiveDate.create({ date, note: note || "", isActive: true });
      return NextResponse.json({ success: true, date: newDate });
    }

    // In-memory fallback
    const exists = fallbackDates.find((d) => d.date === date);
    if (!exists) {
      const item = { date, note: note || "", isActive: true };
      fallbackDates.push(item);
      fallbackDates.sort((a, b) => a.date.localeCompare(b.date));
    }
    return NextResponse.json({ success: true, dates: fallbackDates });
  } catch (error) {
    console.error("Add date error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add date" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    // Verify admin authentication
    const token = req.cookies.get("mex_admin_token")?.value;
    if (!verifySessionToken(token)) {
      return NextResponse.json(
        { success: false, error: "অননুমোদিত অ্যাক্সেস। প্রথমে লগইন করুন।" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { success: false, error: "Date parameter required" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    if (db) {
      await ActiveDate.deleteOne({ date });
      return NextResponse.json({ success: true });
    }

    fallbackDates = fallbackDates.filter((d) => d.date !== date);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete date error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete date" },
      { status: 500 }
    );
  }
}
