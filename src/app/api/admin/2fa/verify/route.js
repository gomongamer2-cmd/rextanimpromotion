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

    const { secret, code } = await req.json();

    if (!secret || !code) {
      return NextResponse.json(
        { success: false, error: "সিক্রেট ও ৬-সংখ্যার কোড প্রদান করুন।" },
        { status: 400 }
      );
    }

    const isValid = verifyTOTP(code, secret);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "ভুল ওটিপি কোড! অনুগ্রহ করে অ্যাপের বর্তমান কোডটি লিখুন।" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    if (db) {
      let admin = await Admin.findOne({ username: "admin" });
      if (admin) {
        admin.twoFactorEnabled = true;
        admin.twoFactorSecret = secret;
        await admin.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "✓ Google Authenticator 2FA সফলভাবে সক্রিয় করা হয়েছে!",
    });
  } catch (error) {
    console.error("2FA verify error:", error);
    return NextResponse.json(
      { success: false, error: "যাচাইকরণ ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
