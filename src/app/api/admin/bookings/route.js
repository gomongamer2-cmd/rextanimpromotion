import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Booking from "../../../../models/Booking";
import Slot from "../../../../models/Slot";
import { verifySessionToken } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

// In-memory fallback if MONGODB_URI is not set
let fallbackBookings = [
  {
    _id: "demo_1",
    orderId: "MEX-8419",
    clientName: "BD Tigers Esports",
    phone: "01712345678",
    category: "WhatsApp Group Promotion",
    videoCount: 3,
    totalPrice: 2000,
    bioLinkDays: 3,
    selectedDate: "2026-11-20",
    selectedTimeSlot: "07:00 PM - 08:00 PM",
    tournamentDetails: "Free Fire Community Cup Season 2",
    orgLogoLink: "https://drive.google.com/...",
    paymentMethod: "bKash Personal",
    trxId: "BL9A7K80PX",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req) {
  try {
    const token = req.cookies.get("mex_admin_token")?.value;
    if (!verifySessionToken(token)) {
      return NextResponse.json(
        { success: false, error: "অননুমোদিত অ্যাক্সেস। প্রথমে লগইন করুন।" },
        { status: 401 }
      );
    }

    const db = await connectDB();
    if (db) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, bookings });
    }

    return NextResponse.json({ success: true, bookings: fallbackBookings });
  } catch (error) {
    console.error("Fetch admin bookings error:", error);
    return NextResponse.json({ success: true, bookings: fallbackBookings });
  }
}

export async function PATCH(req) {
  try {
    const token = req.cookies.get("mex_admin_token")?.value;
    if (!verifySessionToken(token)) {
      return NextResponse.json(
        { success: false, error: "অননুমোদিত অ্যাক্সেস। প্রথমে লগইন করুন।" },
        { status: 401 }
      );
    }

    const { orderId, status } = await req.json();

    if (!orderId || !["confirmed", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid orderId or status" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    if (db) {
      const booking = await Booking.findOne({ orderId });
      if (!booking) {
        return NextResponse.json(
          { success: false, error: "Booking not found" },
          { status: 404 }
        );
      }

      booking.status = status;
      await booking.save();

      // If rejected, free up the slot so others can book it!
      if (status === "rejected") {
        await Slot.findOneAndUpdate(
          { date: booking.selectedDate, timeSlot: booking.selectedTimeSlot },
          { isBooked: false, orderId: null }
        );
      } else if (status === "confirmed") {
        await Slot.findOneAndUpdate(
          { date: booking.selectedDate, timeSlot: booking.selectedTimeSlot },
          { isBooked: true, orderId: booking.orderId },
          { upsert: true }
        );
      }

      return NextResponse.json({ success: true, booking });
    }

    // In-memory fallback
    const item = fallbackBookings.find((b) => b.orderId === orderId);
    if (item) {
      item.status = status;
    }
    return NextResponse.json({ success: true, booking: item });
  } catch (error) {
    console.error("Update booking status error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update booking" },
      { status: 500 }
    );
  }
}
