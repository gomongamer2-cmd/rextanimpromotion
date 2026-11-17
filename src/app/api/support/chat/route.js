import { NextResponse } from "next/server";
import { generateAiSupportReply } from "../../../../lib/supportBot";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "মেসেজ খালি হতে পারে না।" },
        { status: 400 }
      );
    }

    const cleanMessage = message.trim().slice(0, 1000);
    const cleanHistory = Array.isArray(history) ? history.slice(-6) : [];

    const reply = await generateAiSupportReply(cleanMessage, cleanHistory);

    return NextResponse.json({
      success: true,
      reply,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Support chat API error:", error);
    return NextResponse.json(
      {
        success: true,
        reply: "জি ভাইয়া শুনতে পাচ্ছি! Mex Tanim Esports-এর স্লট বুকিং, পেমেন্ট বা টুর্নামেন্ট নিয়ে কীভাবে সাহায্য করতে পারি বলেন? 🌸",
        timestamp: Date.now(),
      },
      { status: 200 }
    );
  }
}
