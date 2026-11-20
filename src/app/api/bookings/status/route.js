import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Booking from "../../../../models/Booking";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing orderId" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    if (db) {
      const booking = await Booking.findOne({ orderId }).lean();
      if (!booking) {
        return NextResponse.json({ success: true, exists: false });
      }

      const isCompleted = booking.status === "completed";
      return NextResponse.json({
        success: true,
        exists: true,
        status: booking.status,
        isCompleted,
        booking,
      });
    }

    // In-memory preview fallback
    return NextResponse.json({
      success: true,
      exists: true,
      status: "pending",
      isCompleted: false,
    });
  } catch (err) {
    console.error("Check booking status error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to check booking status" },
      { status: 500 }
    );
  }
}
