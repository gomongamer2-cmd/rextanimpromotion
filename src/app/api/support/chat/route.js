import { NextResponse } from "next/server";
import {
  generateAiSupportReply,
  getGeminiApiKeyPool,
  requestGeminiApi,
} from "../../../../lib/supportBot";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pool = getGeminiApiKeyPool();
    const masked = pool.map((k) =>
      k.length > 8 ? `${k.slice(0, 4)}...${k.slice(-4)}` : "KEY"
    );

    let testResults = [];

    if (pool.length > 0) {
      const firstKey = pool[0];
      const payload = JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "ping" }] }],
      });

      for (const model of ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-2.0-flash"]) {
        try {
          const res = await requestGeminiApi(model, payload, firstKey, 10000);
          testResults.push({ model, success: true, reply: res });
        } catch (e) {
          testResults.push({ model, success: false, error: e.message });
        }
      }
    }

    return NextResponse.json({
      status: "online",
      envKeysDetected: pool.length,
      keysMaskedPreview: masked,
      testResults,
      serverTime: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { status: "error", error: e.message },
      { status: 500 }
    );
  }
}

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
