import https from "https";
import aiKnowledge from "../data/ai_knowledge.json";

// -------------------------------------------------------------
// Dynamic Multi-Key Pool & Round-Robin Load Balancer for Gemini
// -------------------------------------------------------------
let keyPoolIndex = 0;
const keyCooldowns = {}; // apiKey -> cooldownUntilTimestamp

export function getGeminiApiKeyPool() {
  const raw =
    process.env.GEMINI_API_KEYS ||
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEYS ||
    "";

  let rawKeys = [];
  if (Array.isArray(raw)) {
    rawKeys = raw;
  } else if (typeof raw === "string") {
    let str = raw.trim();
    if (str.startsWith("[") && str.endsWith("]")) {
      str = str.slice(1, -1);
    }
    rawKeys = str.split(/[\r\n,;]+/);
  }

  const pool = Array.from(
    new Set(
      rawKeys
        .map((k) => {
          if (typeof k !== "string") return "";
          return k.replace(/^["'`\[\]\s]+|["'`\[\]\s]+$/g, "").trim();
        })
        .filter((k) => k && k.length > 8)
    )
  );

  return pool;
}

export function getOrderedCandidateKeys() {
  const pool = getGeminiApiKeyPool();
  if (pool.length === 0) return [];

  const now = Date.now();
  const startIdx = keyPoolIndex % pool.length;
  keyPoolIndex = (keyPoolIndex + 1) % pool.length;

  const ordered = [];
  for (let i = 0; i < pool.length; i++) {
    ordered.push(pool[(startIdx + i) % pool.length]);
  }

  const available = ordered.filter((k) => !keyCooldowns[k] || keyCooldowns[k] <= now);
  const coolingDown = ordered
    .filter((k) => keyCooldowns[k] && keyCooldowns[k] > now)
    .sort((a, b) => (keyCooldowns[a] || 0) - (keyCooldowns[b] || 0));

  return available.length > 0 ? available : coolingDown;
}

// Low-level HTTPS request to Gemini API (Zero external npm dependencies)
export function requestGeminiApi(modelName, data, apiKey, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    const cleanKey = (apiKey || "")
      .replace(/^["'`\[\]\s]+|["'`\[\]\s]+$/g, "")
      .trim();
    const encodedModel = encodeURIComponent(modelName);

    // If key starts with AQ., do NOT append ?key= in the URL query string.
    // Google AI Studio's newer Authorization keys (AQ. prefix) must be passed exclusively
    // via x-goog-api-key header; passing ?key=AQ... causes Google edge proxy to reject with ACCESS_TOKEN_TYPE_UNSUPPORTED.
    const queryParam = cleanKey.startsWith("AQ.")
      ? ""
      : `?key=${encodeURIComponent(cleanKey)}`;

    const req = https.request(
      {
        hostname: "generativelanguage.googleapis.com",
        path: `/v1beta/models/${encodedModel}:generateContent${queryParam}`,
        method: "POST",
        timeout: timeoutMs,
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": cleanKey,
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const json = JSON.parse(body);
              const reply = json.candidates?.[0]?.content?.parts?.[0]?.text;
              if (reply) return resolve(reply.trim());
            } catch (_) {}
            return reject(new Error("Invalid JSON structure from Gemini API"));
          } else {
            console.error(
              `⚠️ [GEMINI ERROR] HTTP ${res.statusCode} (${modelName}):`,
              body.slice(0, 300)
            );
            const apiErr = new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`);
            apiErr.statusCode = res.statusCode;
            return reject(apiErr);
          }
        });
      }
    );

    req.on("timeout", () => {
      req.destroy();
      console.warn(`⚠️ [GEMINI TIMEOUT] Request timed out after ${timeoutMs}ms (${modelName})`);
      const timeoutErr = new Error(`Timeout after ${timeoutMs}ms`);
      timeoutErr.statusCode = 408;
      reject(timeoutErr);
    });

    req.on("error", (err) => {
      console.error(`⚠️ [GEMINI NETWORK ERROR]`, err.message);
      reject(err);
    });
    req.write(data);
    req.end();
  });
}

// Sanitizes and formats history for Gemini API strict alternating turns
function formatGeminiContents(history = [], currentText = "") {
  const raw = [];
  if (Array.isArray(history)) {
    for (const item of history) {
      if (!item || !item.role || !item.text) continue;
      raw.push({
        role: item.role === "model" || item.role === "assistant" ? "model" : "user",
        parts: [{ text: String(item.text).slice(0, 1000) }],
      });
    }
  }

  if (currentText) {
    raw.push({ role: "user", parts: [{ text: String(currentText).slice(0, 1000) }] });
  }

  while (raw.length > 0 && raw[0].role !== "user") {
    raw.shift();
  }

  const clean = [];
  for (const turn of raw) {
    if (clean.length === 0) {
      clean.push(turn);
    } else {
      const last = clean[clean.length - 1];
      if (last.role === turn.role) {
        last.parts = last.parts.concat(turn.parts);
      } else {
        clean.push(turn);
      }
    }
  }

  while (clean.length > 0 && clean[clean.length - 1].role !== "user") {
    clean.pop();
  }

  if (clean.length === 0) {
    clean.push({ role: "user", parts: [{ text: currentText || "হ্যালো" }] });
  }

  return clean;
}

// Helper: formats current time in Bangladesh (Asia/Dhaka)
function getDhakaTime() {
  try {
    return new Intl.DateTimeFormat("bn-BD", {
      timeZone: "Asia/Dhaka",
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date());
  } catch (_) {
    return new Date().toISOString();
  }
}

// Core Support Reply Generator
export async function generateAiSupportReply(userMessage, conversationHistory = []) {
  const candidateKeys = getOrderedCandidateKeys();
  const nowDhaka = getDhakaTime();

  const systemInstruction = `
YOU ARE "লিসা (Lisa)", THE OFFICIAL 24/7 FEMALE AI SUPPORT EXECUTIVE FOR "Mex Tanim Esports" (Lead Creator: Tanim / Mex Tanim).
YOU SPEAK NATURAL, WARM, SHORT, FRIENDLY GAMER BENGALI.

KNOWLEDGE BASE:
${JSON.stringify(aiKnowledge, null, 2)}

CURRENT BANGLADESH TIME: ${nowDhaka}

CORE BEHAVIOR RULES:
1. Always be extremely polite, friendly, helpful, and natural (speak like a supportive female gaming assistant named Lisa).
2. Identity: If asked who you are ("tmi k", "কে তুমি", "porichoy"), answer: "আমি লিসা ভাইয়া! Mex Tanim Esports-এর ২৪/৭ লাইভ সাপোর্ট অ্যাসিস্ট্যান্ট। টুর্নামেন্ট স্লট বুকিং, পেমেন্ট বা ওয়েবসাইট নিয়ে কীভাবে সাহায্য করতে পারি বলেন? 🌸🎮"
3. Payment info:
   - বিকাশ পার্সোনাল: 01611657757 (Send Money Only)
   - নগদ পার্সোনাল: 01611657757 (Send Money Only)
   - রকেট পার্সোনাল: 01611657757 (Send Money Only)
   - ফুল অ্যাডভান্স পেমেন্ট প্রযোজ্য। পেমেন্ট করে ট্রানজেকশন আইডি (TrxID) দিতে হবে।
4. Tournaments:
   - Regular Daily Matches: Champion Rush (৬০৳), Big Champion Rush (১০০৳), Mini Blust (৬০৳), V Badge Blust (৯০৳), Daily Live (৯০৳), Special Blust (৮৫৳), এবং ১০ PM ড্রোন ভিউ ম্যাচ (১০০৳)।
   - Mega Tournament: MTE International War S1 (১০,০০০৳ প্রাইজপুল, প্রো স্লট ২৮০৳, রাইজিং স্লট ১২০৳)।
5. Promotion Services (Website Booking Desk):
   - টুর্নামেন্ট অ্যাপ প্রমোশন
   - হোয়াটসঅ্যাপ চ্যানেল প্রমোশন
   - হোয়াটসঅ্যাপ গ্রুপ প্রমোশন
   - ক্লায়েন্টরা সরাসরি ওয়েবসাইটে ১ম ধাপ থেকে ৪থ ধাপে গিয়ে স্লট নির্বাচন করে বুকিং করতে পারে।
6. Admin direct contact:
   - "তানিম ভাইয়ার সাথে কথা বলতে চান? আপনি ওয়েবসাইটের উপরের হোয়াটসঅ্যাপ বাটনে ক্লিক করে সরাসরি তানিম ভাইয়ের অফিশিয়াল ডেস্কে মেসেজ দিতে পারেন ❤️"
7. Style:
   - Keep answers concise, helpful, and direct (1-3 sentences max).
   - Avoid robotic corporate disclaimers. Speak naturally like a supportive gamer sister/helper.
   - Do NOT repeat Salam unless the user greets first.
`;

  // Try calling Gemini models with load balanced keys
  const primaryModel = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

  if (candidateKeys.length === 0) {
    console.warn(
      "⚠️ [GEMINI WARNING] No API keys detected in GEMINI_API_KEYS or GEMINI_API_KEY environment variables."
    );
  } else {
    const contents = formatGeminiContents(conversationHistory.slice(-6), userMessage);

    const payload = JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 350,
      },
    });

    for (let i = 0; i < candidateKeys.length; i++) {
      const activeKey = candidateKeys[i];
      const masked =
        activeKey.length > 8
          ? `${activeKey.slice(0, 4)}...${activeKey.slice(-4)}`
          : "KEY";
      try {
        const reply = await requestGeminiApi(primaryModel, payload, activeKey, 12000);
        if (reply && reply.length > 0) {
          return reply;
        }
      } catch (err) {
        console.warn(
          `⚠️ [GEMINI KEY ${masked} FAILED (${primaryModel})]: ${err.message}`
        );
        if (err.statusCode === 429 || err.statusCode === 403) {
          keyCooldowns[activeKey] = Date.now() + 60000;
        }

        // Try backup models if on last key
        if (i === candidateKeys.length - 1) {
          for (const fallbackModel of ["gemini-3.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]) {
            try {
              const fallbackReply = await requestGeminiApi(
                fallbackModel,
                payload,
                activeKey,
                12000
              );
              if (fallbackReply && fallbackReply.length > 0) {
                return fallbackReply;
              }
            } catch (fbErr) {
              console.warn(
                `⚠️ [GEMINI BACKUP (${fallbackModel}) FAILED]: ${fbErr.message}`
              );
            }
          }
        }
      }
    }
  }

  // Smart fallback in case all keys are busy or offline
  const lower = (userMessage || "").toLowerCase();
  if (lower.includes("payment") || lower.includes("পেমেন্ট") || lower.includes("টাকা") || lower.includes("bkash") || lower.includes("বিকাশ") || lower.includes("nagad") || lower.includes("নগদ")) {
    return "ভাইয়া আমাদের পেমেন্ট মেথড হলো Send Money Only:\nবিকাশ/নগদ/রকেট: 01611657757\nটাকা পাঠিয়ে ট্রানজেকশন আইডি (TrxID) সাইটের ফর্মে দিয়ে স্লট নিশ্চিত করে ফেলুন 🌸";
  }
  if (lower.includes("slot") || lower.includes("স্লট") || lower.includes("tour") || lower.includes("টুর্নামেন্ট") || lower.includes("khelbo")) {
    return "জি ভাইয়া স্লট খালি আছে! আমাদের রেগুলার ডেইলি টুর্নামেন্ট (৬০৳, ৮৫৳, ৯০৳, ১০০৳) ও MTE International War S1 (১০,০০০৳ প্রাইজপুল) চলতেছে। সাইট থেকেই সরাসরি বুকিং করতে পারেন অথবা তানিম ভাইয়ের হোয়াটসঅ্যাপে নক দিন 🎮";
  }
  if (lower.includes("link") || lower.includes("লিংক") || lower.includes("social") || lower.includes("channel") || lower.includes("youtube")) {
    return "Mex Tanim Esports-এর অফিসিয়াল লিংকসমূহ:\n📺 YouTube: https://youtube.com/@mextanimesports\n💬 WhatsApp Channel: https://whatsapp.com/channel/0029Vb6F0j54Y9lssQHIcv0s\n✈️ Telegram: https://t.me/mextanimesports";
  }
  if (lower.includes("tmi k") || lower.includes("tumi ke") || lower.includes("who are you") || lower.includes("পরিচয়")) {
    return "আমি লিসা ভাইয়া! Mex Tanim Esports-এর ২৪/৭ লাইভ সাপোর্ট অ্যাসিস্ট্যান্ট। টুর্নামেন্ট স্লট বা বুকিং নিয়ে যেকোনো তথ্যে আপনাকে সাহায্য করতে প্রস্তুত 🌸🎮";
  }

  return "জি ভাইয়া শুনতে পাচ্ছি! Mex Tanim Esports-এর স্লট বুকিং, পেমেন্ট বা প্রমোশন সংক্রান্ত যেকোনো প্রয়োজনে বলুন, আমি এখনই হেল্প করছি 🌸";
}
