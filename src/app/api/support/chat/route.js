import { NextResponse } from "next/server";
import { generateAiSupportReply } from "../../../../lib/supportBot";
import { checkRateLimit, getClientIp } from "../../../../lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "Mex Tanim AI Support Bot",
    serverTime: new Date().toISOString(),
  });
}

export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(ip, "chat-support", 20, 5 * 60 * 1000);

    if (rateCheck.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          error: "অল্প সময়ে বেশি মেসেজ পাঠানো হয়েছে। দয়া করে কিছুক্ষণ অপেক্ষা করুন।",
        },
        { status: 429 }
      );
    }

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
        reply: "জি, শুনতে পাচ্ছি! Mex Tanim Esports-এর প্রমোশন প্যাকেজ, তারিখ বুকিং বা পেমেন্ট নিয়ে কীভাবে সাহায্য করতে পারি?",
        timestamp: Date.now(),
      },
      { status: 200 }
    );
  }
}
