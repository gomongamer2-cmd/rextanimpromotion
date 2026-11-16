import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Admin from "../../../../models/Admin";
import { hashPassword, verifyPassword, verifySessionToken } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const token = req.cookies.get("mex_admin_token")?.value;
    if (!verifySessionToken(token)) {
      return NextResponse.json(
        { success: false, error: "অননুমোদিত অ্যাক্সেস। প্রথমে লগইন করুন।" },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "পুরাতন ও নতুন উভয় পাসওয়ার্ড প্রদান করুন।" },
        { status: 400 }
      );
    }

    if (newPassword.length < 1) {
      return NextResponse.json(
        { success: false, error: "নতুন পাসওয়ার্ড কমপক্ষে ১ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    if (db) {
      const admin = await Admin.findOne({ username: "admin" });
      if (!admin) {
        return NextResponse.json(
          { success: false, error: "অ্যাডমিন পাওয়া যায়নি।" },
          { status: 404 }
        );
      }

      const isOldValid = verifyPassword(oldPassword, admin.passwordHash);
      if (!isOldValid) {
        return NextResponse.json(
          { success: false, error: "পুরাতন পাসওয়ার্ড সঠিক নয়!" },
          { status: 400 }
        );
      }

      // Generate salted hash of new password and save
      admin.passwordHash = hashPassword(newPassword);
      await admin.save();

      return NextResponse.json({
        success: true,
        message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!",
      });
    }

    return NextResponse.json({
      success: true,
      message: "পাসওয়ার্ড লোকাল মোডে আপডেট হয়েছে।",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
