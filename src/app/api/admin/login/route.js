import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Admin from "../../../../models/Admin";
import { hashPassword, verifyPassword, createSessionToken } from "../../../../lib/auth";
import { verifyTOTP } from "../../../../lib/totp";
import { checkRateLimit, recordFailure, resetLimit, getClientIp } from "../../../../lib/rateLimit";

export const dynamic = "force-dynamic";

// In-memory fallback if MONGODB_URI is not set
let fallbackAdmin = {
  username: "admin",
  passwordHash: hashPassword("1"),
  twoFactorEnabled: false,
  twoFactorSecret: null,
};

export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(ip, "admin-login", 5, 15 * 60 * 1000);

    if (rateCheck.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          error: `অতিরিক্ত ভুল লগইন চেষ্টার কারণে এক্সেস লক করা হয়েছে। ${Math.ceil(rateCheck.retryAfterSec / 60)} মিনিট পর আবার চেষ্টা করুন।`,
        },
        { status: 429 }
      );
    }

    const { username, password, twoFactorCode } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "ইউজারনেম ও পাসওয়ার্ড প্রদান করুন।" },
        { status: 400 }
      );
    }

    let isValid = false;
    let targetAdmin = null;
    const db = await connectDB();

    if (db) {
      let admin = await Admin.findOne({ username: username.trim() });

      // Auto-seed initial admin with hashed password "1" if first run
      if (!admin && username.trim() === "admin") {
        admin = await Admin.create({
          username: "admin",
          passwordHash: hashPassword("1"),
          twoFactorEnabled: false,
        });
      }

      if (admin) {
        isValid = verifyPassword(password, admin.passwordHash);
        targetAdmin = admin;
      }
    } else {
      // In-memory fallback
      if (username.trim() === fallbackAdmin.username) {
        isValid = verifyPassword(password, fallbackAdmin.passwordHash);
        targetAdmin = fallbackAdmin;
      }
    }

    if (!isValid || !targetAdmin) {
      recordFailure(ip, "admin-login", 15 * 60 * 1000);
      return NextResponse.json(
        { success: false, error: "ভুল ইউজারনেম বা পাসওয়ার্ড!" },
        { status: 401 }
      );
    }

    // Check if 2-Factor Authentication is enabled
    if (targetAdmin.twoFactorEnabled) {
      // Step 1: Client has not sent 2FA code yet
      if (!twoFactorCode) {
        return NextResponse.json({
          success: true,
          requires2FA: true,
          message: "২-ফ্যাক্টর (2FA) কোড প্রয়োজন।",
        });
      }

      // Step 2: Client provided 2FA code, verify TOTP
      const isCodeValid = verifyTOTP(twoFactorCode, targetAdmin.twoFactorSecret);
      if (!isCodeValid) {
        recordFailure(ip, "admin-login", 15 * 60 * 1000);
        return NextResponse.json(
          { success: false, error: "ভুল ২-ফ্যাক্টর ওটিপি কোড!" },
          { status: 401 }
        );
      }
    }

    // Reset rate limiter on successful authentication
    resetLimit(ip, "admin-login");

    // Credentials & 2FA (if active) are valid -> Issue signed session token
    const token = createSessionToken(username.trim());

    const response = NextResponse.json({
      success: true,
      message: "লগইন সফল হয়েছে।",
    });

    response.cookies.set("mex_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "সার্ভারে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
