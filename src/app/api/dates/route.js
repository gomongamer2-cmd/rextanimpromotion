import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import ActiveDate from "../../../models/ActiveDate";
import Slot from "../../../models/Slot";
import Booking from "../../../models/Booking";
import { verifySessionToken } from "../../../lib/auth";

export const dynamic = "force-dynamic";

// Format date in Asia/Dhaka time zone as YYYY-MM-DD
function getDhakaDateString(date = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date);
  } catch (e) {
    return new Date(date).toISOString().slice(0, 10);
  }
}

// In-memory fallback if MONGODB_URI is not set
let fallbackDates = [];
let fallbackBookedSet = new Set();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const forAdmin = searchParams.get("all") === "true";
    const todayDhakaStr = getDhakaDateString(new Date());

    const db = await connectDB();
    if (db) {
      const allActiveDates = await ActiveDate.find({ isActive: true }).sort({ date: 1 }).lean();

      // Collect all booked dates from Slot and Booking (excluding rejected)
      const bookedSlots = await Slot.find({ isBooked: true }).lean();
      const bookedSlotDates = new Set(bookedSlots.map((s) => s.date));

      const activeBookings = await Booking.find({ status: { $ne: "rejected" } }).lean();
      const activeBookingDates = new Set(activeBookings.map((b) => b.selectedDate));

      const bookedDateSet = new Set([...bookedSlotDates, ...activeBookingDates]);

      const enrichedDates = allActiveDates.map((doc) => {
        const isBooked = bookedDateSet.has(doc.date);
        const createdDateStr = doc.createdAt
          ? getDhakaDateString(new Date(doc.createdAt))
          : todayDhakaStr;

        return {
          ...doc,
          isBooked,
          createdDateStr,
        };
      });

      // Admin View: see all dates along with isBooked status
      if (forAdmin) {
        return NextResponse.json({ success: true, dates: enrichedDates });
      }

      // Public Client View (Step 3):
      // 1. Any date strictly before today (past promotion date) is hidden.
      // 2. If added TODAY (createdDateStr === todayDhakaStr):
      //    Visible all day (clients see it as either "Available" or "Booked").
      // 3. Past midnight of creation day (createdDateStr < todayDhakaStr):
      //    - If booked -> HIDE IT (midnight rollover clears booked dates from Step 3).
      //    - If NOT booked -> KEEP IT VISIBLE so clients can still book it!
      const visibleDates = enrichedDates.filter((item) => {
        if (item.date < todayDhakaStr) return false;

        const isAddedToday = item.createdDateStr === todayDhakaStr;
        if (isAddedToday) {
          return true;
        }

        // Past midnight of the day it was added:
        return !item.isBooked;
      });

      return NextResponse.json({ success: true, dates: visibleDates });
    }

    // In-memory fallback
    const enrichedFallback = fallbackDates.map((doc) => ({
      ...doc,
      isBooked: fallbackBookedSet.has(doc.date),
      createdDateStr: doc.createdDateStr || todayDhakaStr,
    }));

    if (forAdmin) {
      return NextResponse.json({ success: true, dates: enrichedFallback });
    }

    const visibleFallback = enrichedFallback.filter((item) => {
      if (item.date < todayDhakaStr) return false;
      const isAddedToday = item.createdDateStr === todayDhakaStr;
      if (isAddedToday) return true;
      return !item.isBooked;
    });

    return NextResponse.json({ success: true, dates: visibleFallback });
  } catch (error) {
    console.error("Fetch dates error:", error);
    return NextResponse.json({ success: true, dates: [] });
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
