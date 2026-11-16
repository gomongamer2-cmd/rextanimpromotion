import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Admin from "../../../../../models/Admin";
import { verifySessionToken } from "../../../../../lib/auth";
import { verifyTOTP } from "../../../../../lib/totp";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const token = req.cookies.get("mex_admin_token")?.value;
    if (!verifySessionToken(token)) {
      return NextResponse.json(
        { success: false, error: "অননুমোদিত অ্যাক্সেস।" },
        { status: 401 }
      );
    }

    const { code } = await req.json();

    const db = await connectDB();
    if (db) {
      const admin = await Admin.findOne({ username: "admin" });
      if (!admin || !admin.twoFactorEnabled) {
        return NextResponse.json(
          { success: false, error: "2FA ইতিমধ্যে নিষ্ক্রিয় রয়েছে।" },
          { status: 400 }
        );
      }

      if (code) {
        const isValid = verifyTOTP(code, admin.twoFactorSecret);
        if (!isValid) {
          return NextResponse.json(
            { success: false, error: "ভুল ওটিপি কোড!" },
            { status: 400 }
          );
        }
      }

      admin.twoFactorEnabled = false;
      admin.twoFactorSecret = null;
      await admin.save();
    }

    return NextResponse.json({
      success: true,
      message: "2FA সফলভাবে নিষ্ক্রিয় করা হয়েছে।",
    });
  } catch (error) {
    console.error("2FA disable error:", error);
    return NextResponse.json(
      { success: false, error: "2FA নিষ্ক্রিয় করা যায়নি।" },
      { status: 500 }
    );
  }
}
