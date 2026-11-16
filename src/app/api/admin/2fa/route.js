import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { connectDB } from "../../../../lib/mongodb";
import Admin from "../../../../models/Admin";
import { verifySessionToken } from "../../../../lib/auth";
import { generateBase32Secret } from "../../../../lib/totp";

export const dynamic = "force-dynamic";

// In-memory fallback
let fallback2FA = {
  enabled: false,
  secret: null,
};

export async function GET(req) {
  try {
    const token = req.cookies.get("mex_admin_token")?.value;
    if (!verifySessionToken(token)) {
      return NextResponse.json(
        { success: false, error: "অননুমোদিত অ্যাক্সেস।" },
        { status: 401 }
      );
    }

    const db = await connectDB();
    if (db) {
      const admin = await Admin.findOne({ username: "admin" });
      return NextResponse.json({
        success: true,
        twoFactorEnabled: admin?.twoFactorEnabled || false,
      });
    }

    return NextResponse.json({
      success: true,
      twoFactorEnabled: fallback2FA.enabled,
    });
  } catch (error) {
    console.error("2FA status error:", error);
    return NextResponse.json(
      { success: false, error: "স্ট্যাটাস লোড করা যায়নি।" },
      { status: 500 }
    );
  }
}

// POST: Generate new 2FA secret and QR Code for setup
export async function POST(req) {
  try {
    const token = req.cookies.get("mex_admin_token")?.value;
    if (!verifySessionToken(token)) {
      return NextResponse.json(
        { success: false, error: "অননুমোদিত অ্যাক্সেস।" },
        { status: 401 }
      );
    }

    const secret = generateBase32Secret(20);
    const issuer = "Mex Tanim Esports";
    const account = "admin";
    const otpAuthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(
      account
    )}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;

    const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl, {
      width: 260,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return NextResponse.json({
      success: true,
      secret,
      qrCodeUrl,
    });
  } catch (error) {
    console.error("2FA setup error:", error);
    return NextResponse.json(
      { success: false, error: "2FA সেটআপ তৈরি করা যায়নি।" },
      { status: 500 }
    );
  }
}
