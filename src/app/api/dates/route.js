import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import ActiveDate from "../../../models/ActiveDate";
import { verifySessionToken } from "../../../lib/auth";

export const dynamic = "force-dynamic";

// In-memory fallback if MONGODB_URI is not set
let fallbackDates = [];

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
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

    const body = await req.json();
    const { date, dates, note } = body;

    const datesToAdd = Array.isArray(dates) && dates.length > 0
      ? dates.filter(Boolean)
      : (date ? [date] : []);

    if (datesToAdd.length === 0) {
      return NextResponse.json(
        { success: false, error: "কমপক্ষে একটি তারিখ নির্বাচন করুন।" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    if (db) {
      const results = [];
      for (const d of datesToAdd) {
        const existing = await ActiveDate.findOne({ date: d });
        if (existing) {
          existing.isActive = true;
          if (note !== undefined && note !== "") existing.note = note;
          await existing.save();
          results.push(existing);
        } else {
          const newDoc = await ActiveDate.create({ date: d, note: note || "", isActive: true });
          results.push(newDoc);
        }
      }
      return NextResponse.json({ success: true, count: results.length, dates: results });
    }

    // In-memory fallback
    for (const d of datesToAdd) {
      const exists = fallbackDates.find((item) => item.date === d);
      if (!exists) {
        fallbackDates.push({ date: d, note: note || "", isActive: true });
      }
    }
    fallbackDates.sort((a, b) => a.date.localeCompare(b.date));
    return NextResponse.json({ success: true, count: datesToAdd.length, dates: fallbackDates });
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
