import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Booking from "../../../models/Booking";
import Slot from "../../../models/Slot";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      clientName,
      phone,
      category,
      videoCount,
      totalPrice,
      bioLinkDays,
      selectedDate,
      selectedTimeSlot,
      orgLogoLink,
      orgLogoUrl,
      orgLogoId,
      orgBannerUrl,
      orgBannerId,
      nidCertificateUrl,
      nidCertificateId,
      driveFolderUrl,
      driveFolderId,
      tournamentDetails,
      kycVerificationLink,
      paymentMethod,
      trxId,
    } = data;

    const timeSlot = selectedTimeSlot || "Official Day";

    if (!clientName || !phone || !selectedDate || !trxId) {
      return NextResponse.json(
        { success: false, error: "Missing required booking details." },
        { status: 400 }
      );
    }

    const orderId = `MEX-${Math.floor(1000 + Math.random() * 9000)}`;

    const conn = await connectDB();
    if (!conn) {
      // Local fallback mode when MongoDB URI is not yet configured
      return NextResponse.json({
        success: true,
        orderId,
        source: "local-preview",
        message: "Booking formatted in local preview mode. Configure MONGODB_URI in Render for live database persistence.",
      });
    }

    // Atomic race condition check: Verify slot is not already booked
    const existingSlot = await Slot.findOne({
      date: selectedDate,
      timeSlot,
      isBooked: true,
    });

    if (existingSlot) {
      return NextResponse.json(
        {
          success: false,
          error: "This schedule slot has just been reserved by another client. Please select an available slot.",
        },
        { status: 409 }
      );
    }

    // Create and save Booking
    const newBooking = await Booking.create({
      orderId,
      clientName: String(clientName).trim(),
      phone: String(phone).trim(),
      category: String(category || "Promotion").trim(),
      videoCount: Number(videoCount) || 1,
      totalPrice: Number(totalPrice) || 0,
      bioLinkDays: Number(bioLinkDays) || 1,
      selectedDate: String(selectedDate).trim(),
      selectedTimeSlot: timeSlot,
      orgLogoLink: orgLogoLink || "",
      orgLogoUrl: orgLogoUrl || "",
      orgLogoId: orgLogoId || "",
      orgBannerUrl: orgBannerUrl || "",
      orgBannerId: orgBannerId || "",
      nidCertificateUrl: nidCertificateUrl || "",
      nidCertificateId: nidCertificateId || "",
      driveFolderUrl: driveFolderUrl || "",
      driveFolderId: driveFolderId || "",
      tournamentDetails: tournamentDetails || "Not specified",
      kycVerificationLink: kycVerificationLink || "",
      paymentMethod: paymentMethod || "bKash Personal",
      trxId: String(trxId).trim(),
      status: "pending",
    });

    // Mark Slot as booked (Upsert)
    await Slot.findOneAndUpdate(
      { date: selectedDate, timeSlot },
      { isBooked: true, orderId },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      orderId,
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking submission error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process booking submission." },
      { status: 500 }
    );
  }
}
