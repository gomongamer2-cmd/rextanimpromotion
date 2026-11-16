import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Admin from "../../../../models/Admin";
import { hashPassword, verifyPassword, createSessionToken } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

// In-memory fallback if MONGODB_URI is not set
let fallbackAdmin = {
  username: "admin",
  passwordHash: hashPassword("1"),
};

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "ইউজারনেম ও পাসওয়ার্ড প্রদান করুন।" },
        { status: 400 }
      );
    }

    let isValid = false;
    const db = await connectDB();

    if (db) {
      let admin = await Admin.findOne({ username: username.trim() });

      // Auto-seed initial admin with hashed password "1" if first run
      if (!admin && username.trim() === "admin") {
        admin = await Admin.create({
          username: "admin",
          passwordHash: hashPassword("1"),
        });
      }

      if (admin) {
        isValid = verifyPassword(password, admin.passwordHash);
      }
    } else {
      // In-memory fallback
      if (username.trim() === fallbackAdmin.username) {
        isValid = verifyPassword(password, fallbackAdmin.passwordHash);
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "ভুল ইউজারনেম বা পাসওয়ার্ড!" },
        { status: 401 }
      );
    }

    // Create cryptographically signed token
    const token = createSessionToken(username.trim());

    const response = NextResponse.json({
      success: true,
      message: "লগইন সফল হয়েছে।",
    });

    // Set secure HTTP-only cookie
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
