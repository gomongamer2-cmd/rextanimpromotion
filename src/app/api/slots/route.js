import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Slot from "../../../models/Slot";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { success: false, error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const conn = await connectDB();
    if (!conn) {
      // Graceful fallback if MongoDB is not connected yet
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        bookedSlots: [],
      });
    }

    const booked = await Slot.find({ date, isBooked: true }).select("timeSlot -_id");
    const bookedSlots = booked.map((b) => b.timeSlot);

    return NextResponse.json({
      success: true,
      date,
      bookedSlots,
    });
  } catch (error) {
    console.error("Slot fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve slot availability" },
      { status: 500 }
    );
  }
}
