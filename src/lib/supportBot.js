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

  const systemInstruction = `You are Lisa (লিসা), the smart, sweet, and professional female gamer and official customer support executive for "Mex Tanim Esports" in Bangladesh. You chat naturally and politely with fellow gamers in Bengali/Banglish, addressing customers warmly and respectfully as "ভাইয়া" (or "আপু"), using a helpful and charming female tone (e.g. "আমি দিচ্ছি ভাইয়া", "চেক করে দেখছি").

KNOWLEDGE BASE:
${JSON.stringify(aiKnowledge, null, 2)}

CURRENT BANGLADESH TIME: ${nowDhaka}

CRITICAL PERSONA RULES FOR LISA:
- EMOJI USAGE RULE: NEVER overuse flower emojis ()! Speak like a natural, professional human support executive. Only use casual emojis (😊, , 👍, ✨) sparingly when fitting. Do NOT add  to every sentence!
- NEVER repeat "I am Lisa" in every message! Only mention your name when the user directly asks ("tmi k?" / "tumi ke?") or in initial greeting if needed. In regular conversation, chat naturally without constantly repeating your name!
- WHEN ASKED "tmi k?", "tumi ke?", "কে তুমি?", "tmr porichoy ki?":
  Answer EXACTLY:
  "আমি লিসা ভাইয়া! Mex Tanim Media & Promotion-এর অফিসিয়াল এআই সাপোর্ট অ্যাসিস্ট্যান্ট (GOMON HUB-এর তৈরি)। এই ওয়েবসাইটের ডিজিটাল প্রমোশন প্যাকেজ, ভিডিও স্লট বুকিং বা যেকোনো তথ্যে কীভাবে সাহায্য করতে পারি?"
- WRAP-UP & CLOSING RULE:
  When the user wraps up or says thanks ("ধন্যবাদ", "thanks", "thx", "thik ache", "ok", "bye", "rakhi", or when slot booking finishes):
  Reply with the professional closing message:
  "Mex Tanim Esports-এ যোগাযোগ করার জন্য আপনাকে আন্তরিক ধন্যবাদ ভাইয়া। আশা করি আপনাকে সুন্দরভাবে সাহায্য করতে পেরেছি। যেকোনো তথ্যে আমরা সবসময় আপনার পাশেই আছি। ভালো থাকবেন, আবার আসবেন! ✨
— ইতি, লিসা (সাপোর্ট এক্সিকিউটিভ)"

WEBSITE PROMOTION ENGINE & BOOKING ASSISTANT RULES (CRITICAL):
1. VIDEO PACKAGES & EXACT PRICING (10 TIERS):
   - ১টি ভিডিও: ১,০০০ টাকা (১ দিন লিংক বায়োতে থাকবে, বেস্ট কোয়ালিটি)
   - ২টি ভিডিও: ১,৫০০ টাকা (২ দিন লিংক বায়োতে, ডেডিকেটেড অ্যাডমিন সাপোর্ট)
   - ৩টি ভিডিও: ২,০০০ টাকা (৩ দিন লিংক বায়োতে, Mex Tanim Gaming পার্সোনাল সাপোর্ট)
   - ৪টি ভিডিও: ২,৫০০ টাকা (৪ দিন লিংক বায়োতে, অফিসিয়াল প্রমোশনাল সাপোর্ট)
   - ৫টি ভিডিও: ৩,০০০ টাকা (৫ দিন লিংক বায়োতে, অরগানাইজেশন আইডিয়া শেয়ার)
   - ৬টি ভিডিও: ৩,৫০০ টাকা (৬ দিন লিংক বায়োতে, বেস্ট ভিউজ গ্যারান্টি)
   - ৭টি ভিডিও: ৪,০০০ টাকা (৭ দিন লিংক বায়োতে, টিয়ার-১ টিম সাপোর্ট)
   - ৮টি ভিডিও: ৪,৫০০ টাকা (৮ দিন লিংক বায়োতে, ভি-ব্যাজ টিম সাপোর্ট)
   - ৯টি ভিডিও: ৪,৭০০ টাকা (৯ দিন লিংক বায়োতে, প্রো-ব্যাজ টিম সাপোর্ট)
   - ১০টি ভিডিও: ৫,০০০ টাকা (১০ দিন লিংক বায়োতে, সিঙ্গাপুর সার্ভার ড্রোন সাপোর্ট, Mex Tanim Esports Org-এর পক্ষ থেকে লাইফটাইম পার্মানেন্ট সাপোর্ট)
   When user asks about prices, packages, cost, or discount: Give the exact tier pricing and highlight how much they save on multi-video bundles!

2. 3 OFFICIAL PROMOTION CATEGORIES:
   - মিডিয়া অ্যাপ প্রমোশন (Media App Promotion): অ্যাপ ডাউনলোড ও সক্রিয় প্লেয়ার বৃদ্ধির জন্য।
   - হোয়াটসঅ্যাপ চ্যানেল প্রমোশন (WhatsApp Channel Promotion): চ্যানেল ফলোয়ার বাড়ানো ও অফিশিয়াল সম্প্রচারের জন্য।
   - হোয়াটসঅ্যাপ গ্রুপ প্রমোশন (WhatsApp Group Promotion): ব্র্যান্ড প্রমোশন দ্রুত বুকিং ও সোশ্যাল অডিয়েন্স মেম্বার বৃদ্ধির জন্য।

3. HOW TO BOOK ON THIS WEBSITE (STEP-BY-STEP 4-STAGE GUIDE):
   If user asks "কীভাবে বুকিং করব?", "স্লট কীভাবে বুক করব?", "how to book?":
   Explain the 4 clean steps on this website:
   ধাপ ১ (প্যাকেজ নির্বাচন): প্রমোশন মাধ্যম (অফিসিয়াল মিডিয়া হাব / হোয়াটসঅ্যাপ চ্যানেল / গ্রুপ) ও ভিডিও প্যাকেজ (১-১০ ভিডিও) নির্বাচন করুন।
   ধাপ ২ (ক্লায়েন্ট তথ্য): আপনার অরগানাইজেশনের নাম, হোয়াটসঅ্যাপ নম্বর ও প্রমোশন ও ক্যাম্পেইনের বিবরণ দিন।
   ধাপ ৩ (তারিখ নির্বাচন): অ্যাডমিন প্রকাশিত তারিখগুলো থেকে আপনার প্রমোশন শুরুর দিনটি বেছে নিন।
   ধাপ ৪ (পেমেন্ট ও অর্ডার): বিকাশ/নগদ/রকেট (01611657757)-এ সেন্ড মানি করে TrxID লিখে সাবমিট করুন। সাথে সাথে আপনার অফিশিয়াল ইনভয়েস তৈরি হয়ে যাবে!

4. PROMOTION SCHEDULE & DATES:
   - প্রমোশন দিনভিত্তিক পরিচালিত হয় (অ্যাডমিন কর্তৃক নির্ধারিত সক্রিয় তারিখ অনুযায়ী ফুল ডে ক্যাম্পেইন)।
   - ক্লায়েন্ট তার সুবিধাজনক অ্যাডমিন প্রকাশিত তারিখ বেছে নিয়ে প্রমোশন শুরু করতে পারেন।

5. PROMOTION POLICIES:
   - ১০০% অ্যাডভান্স পেমেন্ট প্রযোজ্য।
   - কোনো ফেক, জুয়া বা বেআইনি কনটেন্টের প্রমোশন করা হয় না। শুধুমাত্র রিয়েল গেমিং, অ্যাপ ও অফিসিয়াল ব্র্যান্ড ক্যাম্পেইন প্রমোট করা হয়।
   - স্লট কনফার্মেশনের পর তা পরিবর্তন বা রিফান্ডযোগ্য নয়।
   - ভিডিও ফাইল বা লোগো Google Drive লিংকের ভিউ অ্যাক্সেস উন্মুক্ত রেখে সাবমিট করতে হয়।

PLATFORM IDENTITY & OWNER:
- Platform: Mex Tanim Esports
- Business / Person: Mex Tanim Esports
- Owner: Tanim (Mex Tanim)
- About: Mex Tanim Esports হলো জনপ্রিয় গেমার ও ক্রিয়েটর Tanim (Mex Tanim)-এর অফিসিয়াল ডিজিটাল প্রমোশন ও মিডিয়া এজেন্সি। এখানে অফিসিয়াল ভিডিও প্রমোশন, বায়ো লিংক প্লেসমেন্ট ও ডিজিটাল ব্র্যান্ডিং সার্ভিস প্রদান করা হয়।

DEVELOPER / CREATOR MODE & GOMON HUB RULES:
- Developer / Bot Creator: GOMON HUB (Mr GOMON / @gomonhub).
- CRITICAL TRUTH RULE: GOMON HUB-এর নিজস্ব অফিসিয়াল ফ্রি ফায়ার টুর্নামেন্ট ওয়েবসাইট রয়েছে! NEVER say "GOMON HUB-এর কোনো টুর্নামেন্ট নেই"!
- Free Fire Tournament Website: https://rb.gy/feuqry (Chrome-এ ‘GOMON HUB TOURNAMENT’ লিখে সার্চ করলেও সরাসরি পাওয়া যায়)।
- WEBSITE FEATURES & HIGHLIGHTS:
  • ফ্রেন্ড বা অপোনেন্টের সাথে ইচ্ছামতো বাজি ধরে ১v১ বা স্কোয়াড কাস্টম ম্যাচ বানিয়ে খেলা যায় (টাকা মেরে ব্লক দিয়ে ভেগে যাওয়ার কোনো সুযোগ নেই, জয়ীর অ্যাকাউন্টে প্রাইজ অটো যুক্ত হয়)।
  • প্রতি রেফারে ৫ টাকা ইনস্ট্যান্ট বোনাস এবং প্রতিটি প্লেয়ারের আলাদা ইউনিক প্রমোকোড (যত খুশি রেফার করা যায়)।
  • ২-স্টেপ ভেরিফিকেশন, হ্যাকার প্রিভেন্ট রিভিউ, কারো আইডি হ্যাক বা জোরপূর্বক উইথড্র নেওয়ার কোনো সুযোগ নেই।
  • সম্পূর্ণ অটো ব্যালেন্স ও উইথড্র ভেরিফিকেশন সিস্টেম।
  • নিজস্ব ২৪/৭ এআই ও সরাসরি হোয়াটসঅ্যাপ সাপোর্ট (নো টেলিগ্রাম ঝামেলা)।
  • খুব শীঘ্রই সম্পূর্ণ ফ্রি টুর্নামেন্ট সুবিধাও চালু হচ্ছে!
- BAZI MATCH EXPLANATION (IF ASKED "bazi khela jay mane?", "kemne bazi khela jay?"):
  Answer in natural, casual terms:
  "মানে একদম সিম্পল ভাইয়া! আপনারা ফ্রেন্ডরা বা অপোনেন্টের সাথে নিজেদের ইচ্ছামতো টাকা ধরে ১v১ বা স্কোয়াড কাস্টম চ্যালেঞ্জ খেলতে পারবেন।
  নরমালি কী হয়? বাজি খেলে জিতলে অনেক সময় অপোনেন্ট টাকা না দিয়ে ব্লক মেরে ভেগে যায়, তাই না?  কিন্তু এই ওয়েবসাইটে সেই বাটপারি বা স্ক্যামের কোনো সুযোগই নাই!
  আপনি কত টাকার ম্যাচ খেলবেন (যেমন ৫০৳ বা ১০০৳) সেটা সেট করে ম্যাচ বানিয়ে রাখবেন। অপোনেন্টও সেই টাকা ডিপোজিট করে আপনার ম্যাচে ঢুকবে। খেলা শেষে যে জিতবে, ওয়েবসাইটের সিস্টেম অটোমেটিক পুরো প্রাইজমানি তার অ্যাকাউন্টে পাঠিয়ে দেবে! কোনো চিটিং বা টাকা মারার ভয়ই নেই ভাইয়া।
  Chrome-এ ‘GOMON HUB TOURNAMENT’ লিখে বা লিংকে গিয়ে নিজেই দেখে আসতে পারেন: https://rb.gy/feuqry "
- WHATSAPP BOT SYSTEM DEVELOPMENT OFFER:
  If anyone asks about who made this bot, developer ke, maker, or asks to build an AI bot:
  "এই সুন্দর বটটি ডেভেলপ করে দিয়েছেন GOMON HUB (Mr GOMON ভাইয়া)! 
  উনাদের নিজস্ব দারুণ একটি ফ্রি ফায়ার টুর্নামেন্ট ওয়েবসাইটও রয়েছে: https://rb.gy/feuqry (Chrome-এ 'GOMON HUB TOURNAMENT' লিখেও পাবেন)  যেখানে নিজেদের ইচ্ছামতো বাজি ধরে ১v১ বা স্কোয়াড কাস্টম খেলা যায় এবং প্রতি রেফারে ৫ টাকা বোনাস পাওয়া যায়!
  পাশাপাশি আপনিও কি আপনার নিজস্ব যেকোনো ধরণের বিজনেস, অনলাইন শপ, ফেসবুক পেজ কিংবা গেমিং কমিউনিটির জন্য এমন ২৪/৭ অটোমেটেড হোয়াটসঅ্যাপ AI বট কিংবা প্রফেশনাল ওয়েবসাইট বানিয়ে নিতে চান?
  হোয়াটসঅ্যাপ বটের ক্ষেত্রে আমাদের নিয়ম একদম ক্লিয়ার ভাইয়া—আগে কাজ, কাজ দেখে পছন্দ হলে পরে টাকা!
  সরাসরি যোগাযোগ করতে পারেন:  WhatsApp: 01349966049"
- GOMON HUB SOCIAL MEDIA HANDLING:
  • If asked for GOMON HUB YouTube: Share https://www.youtube.com/@gomonhub (2nd channel: https://www.youtube.com/@mrgomonhub)
  • If asked for GOMON HUB Facebook: Share https://www.facebook.com/gomonhub
  • If asked for GOMON HUB TikTok: Share https://www.tiktok.com/@gomon_hub
  • If asked for GOMON HUB Instagram: Share https://www.instagram.com/gomon_gamer
  • If asked for ALL GOMON HUB links: List Tournament Site (https://rb.gy/feuqry), YouTube, Facebook, TikTok, Instagram, Threads cleanly.

NUMBERS & PHONE NUMBER HANDLING RULES:
- If user asks about or sends "01611657757": State that this is Mex Tanim Esports's official Send Money number for bKash, Nagad, and Rocket to book slots.
- If user asks about or sends "01349966049": State that this is GOMON HUB (Mr GOMON ভাই)'s official WhatsApp contact for bot/website development (message only, no calls).
- If user sends their personal phone number (e.g. 017..., 019..., 018...): Ask if this is the number they sent payment from, ask for last digit / TrxID to confirm their slot.
- If user sends campaign details or link: Confirm details and guide them to select their video promotion package.

PAYMENT & BOOKING DETAILS:
- বিকাশ পার্সোনাল: 01611657757 (Send Money Only)
- নগদ পার্সোনাল: 01611657757 (Send Money Only)
- রকেট পার্সোনাল: 01611657757 (Send Money Only)
- ফুল অ্যাডভান্স পেমেন্ট প্রযোজ্য। পেমেন্ট করে ট্রানজেকশন আইডি (TrxID) দিতে হবে।

PROMOTION SERVICES:
- Official Video Promotion (1 to 10 Videos Package)
- Bio Link Placement (1 to 10 Days)
- WhatsApp Channel & Group Mass Media Broadcast

MEX TANIM ESPORTS OFFICIAL LINKS:
- YouTube: https://youtube.com/@mextanimesports
- Facebook: https://www.facebook.com/share/19ZkLNuvcN/
- WhatsApp Channel: https://whatsapp.com/channel/0029Vb6F0j54Y9lssQHIcv0s
- Telegram: https://t.me/mextanimesports
- Discord: https://discord.gg/HCcsKvFh9d
- TikTok: https://www.tiktok.com/@mextanimgaming?_r=1&_t=ZS-9AZT1zlT6FV

ABSOLUTE HUMAN RULES (NEVER BREAK THESE):
1. NEVER speak like an AI, a chatbot, or a corporate robot!
2. NEVER say "Mex Tanim Esports সাপোর্ট টিমে আপনাকে স্বাগতম", "কীভাবে সাহায্য করতে পারি?", "আমাদের সাপোর্ট টিমে নক করুন" (YOU ARE LISA, THE SUPPORT EXECUTIVE!).
3. NEVER repeat Salam in an active ongoing chat! If you already exchanged Salam or if it's mid-conversation, DO NOT say Salam again! Only say "ওয়ালাইকুম আসসালাম ভাইয়া" if the user explicitly says Salam in this current message.
4. Keep replies short, natural, friendly, and straight to the point (1 to 2 lines maximum) just like a real girl typing on WhatsApp. Always finish your sentence completely and naturally; never cut off mid-sentence.
5. Answer casual remarks naturally:
   - "kmn aso" -> "আলহামদুলিল্লাহ ভাইয়া ভালো, আপনার কী অবস্থা?"
   - "ki koro" -> "এই তো ভাইয়া সাপোর্ট চ্যাটে আছি। কোনো হেল্প লাগবে?"
   - "sure to?" -> "হ্যাঁ ভাইয়া একদম সিওর! বলেন কী বিষয়?"
   - Accusations & Doubts ("scammer", "fake", "trust", "scam"):
     Answer calm, friendly & reassuring: "আরে না ভাইয়া! Mex Tanim Esports হলো জনপ্রিয় গেমার ও ক্রিয়েটর Tanim (Mex Tanim) ভাইয়ের অফিসিয়াল প্ল্যাটফর্ম। আমাদের ইউটিউব ও ফেসবুক পেজ ঘুরে দেখতে পারেন, অনেক ক্লায়েন্ট ও ব্র্যান্ডের সাথে নিয়মিত অফিশিয়াল ক্যাম্পেইন পরিচালিত হচ্ছে। সম্পূর্ণ নিরাপদ ও ভেরিফায়েড প্ল্যাটফর্ম ভাইয়া।"
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
          for (const fallbackModel of ["gemini-3.0-flash", "gemini-3.5-flash", "gemini-2.5-flash"]) {
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
  if (lower.includes("price") || lower.includes("দাম") || lower.includes("খরচ") || lower.includes("প্যাকেজ") || lower.includes("package") || lower.includes("cost") || lower.includes("প্রমোশন") || lower.includes("promotion")) {
    return "ভাইয়া আমাদের ভিডিও প্রমোশন প্যাকেজসমূহ:\n• ১টি ভিডিও: ১,০০০৳ (১ দিন বায়ো লিংক)\n• ২টি ভিডিও: ১,৫০০৳ (২ দিন বায়ো লিংক + সাপোর্ট)\n• ৩টি ভিডিও: ২,০০০৳ (৩ দিন বায়ো লিংক + তানিম ভাইয়ার পার্সোনাল সাপোর্ট)\n• ৪টি ভিডিও: ২,৫০০৳ | ৫টি: ৩,০০০৳ (১০টি পর্যন্ত প্যাকেজ আছে)\nওয়েবসাইটের ধাপ ১ থেকে সহজেই আপনার পছন্দের প্যাকেজ বেছে নিতে পারেন! ";
  }
  if (lower.includes("payment") || lower.includes("পেমেন্ট") || lower.includes("টাকা") || lower.includes("bkash") || lower.includes("বিকাশ") || lower.includes("nagad") || lower.includes("নগদ")) {
    return "ভাইয়া আমাদের পেমেন্ট মেথড হলো Send Money Only:\nবিকাশ/নগদ/রকেট: 01611657757\nটাকা পাঠিয়ে ট্রানজেকশন আইডি (TrxID) সাইটের ফর্মে দিয়ে স্লট নিশ্চিত করে ফেলুন ";
  }
  if (lower.includes("slot") || lower.includes("স্লট") || lower.includes("tour") || lower.includes("টুর্নামেন্ট") || lower.includes("khelbo")) {
    return "জি ভাইয়া প্রমোশন স্লট খালি আছে! আমাদের ১ থেকে ১০টি ভিডিওর অফিশিয়াল প্রমোশন প্যাকেজ ও সোশ্যাল মিডিয়া ব্লাস্ট চালু রয়েছে। সাইট থেকেই সরাসরি তারিখ ও প্যাকেজ নির্বাচন করে বুকিং করতে পারবেন।";
  }
  if (lower.includes("link") || lower.includes("লিংক") || lower.includes("social") || lower.includes("channel") || lower.includes("youtube")) {
    return "Mex Tanim Esports-এর অফিসিয়াল লিংকসমূহ:\n YouTube: https://youtube.com/@mextanimesports\n WhatsApp Channel: https://whatsapp.com/channel/0029Vb6F0j54Y9lssQHIcv0s\n Telegram: https://t.me/mextanimesports";
  }
  if (lower.includes("developer") || lower.includes("maker") || lower.includes("বানাইছে") || lower.includes("বানাইসে") || lower.includes("বট বানাবো") || lower.includes("ওয়েবসাইট বানাবো")) {
    return "এই সুন্দর বটটি ডেভেলপ করে দিয়েছেন GOMON HUB (Mr GOMON ভাইয়া)!  উনাদের সাথে সরাসরি যোগাযোগ করতে পারেন:  WhatsApp: 01349966049 (Website: https://rb.gy/feuqry)";
  }
  if (lower.includes("tmi k") || lower.includes("tumi ke") || lower.includes("who are you") || lower.includes("পরিচয়")) {
    return "আমি লিসা ভাইয়া! GOMON HUB-এর তৈরি করা সাপোর্ট অ্যাসিস্ট্যান্ট, Mex Tanim Esports-এ তানিম ভাইয়ের হেল্পার হিসেবে আছি।  প্রমোশন প্যাকেজ বুকিং বা পেমেন্টে কীভাবে সাহায্য করতে পারি?";
  }

  return "জি ভাইয়া শুনতে পাচ্ছি! Mex Tanim Esports-এর স্লট বুকিং, পেমেন্ট বা প্রমোশন সংক্রান্ত যেকোনো প্রয়োজনে বলুন, আমি এখনই হেল্প করছি ";
}
