"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  Sparkles,
  Bot,
} from "lucide-react";

const STORAGE_KEY = "mex_support_chat_v1";
const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

const INITIAL_MESSAGE = {
  id: "welcome-1",
  role: "model",
  text: "আসসালামু আলাইকুম! আমি লিসা, Mex Tanim Esports-এর অফিশিয়াল এআই অ্যাসিস্ট্যান্ট। ভিডিও প্রমোশন প্যাকেজ, তারিখ বুকিং বা পেমেন্টে কীভাবে সাহায্য করতে পারি?",
  time: new Date().toLocaleTimeString("bn-BD", { hour: "numeric", minute: "numeric" }),
};

// Formatter to render clickable Markdown links [label](url), bare URLs, and bold text **text**
function renderFormattedMessage(text) {
  if (!text) return null;

  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+[^<.,:;"')\]\s])|\*\*([^*]+)\*\*/g;
  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      elements.push(
        <a
          key={`link-${match.index}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--rgb-current)" }}
          className="font-bold underline hover:opacity-80 underline-offset-2 break-all cursor-pointer inline-flex items-center gap-0.5 transition-opacity"
        >
          <span>{match[1]}</span>
          <span className="text-[10px] select-none no-underline">↗</span>
        </a>
      );
    } else if (match[3]) {
      elements.push(
        <a
          key={`url-${match.index}`}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--rgb-current)" }}
          className="font-bold underline hover:opacity-80 underline-offset-2 break-all cursor-pointer inline-flex items-center gap-0.5 transition-opacity"
        >
          <span>{match[3]}</span>
          <span className="text-[10px] select-none no-underline">↗</span>
        </a>
      );
    } else if (match[4]) {
      elements.push(
        <strong key={`bold-${match.index}`} className="font-bold text-white">
          {match[4]}
        </strong>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : text;
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Meta AI Messenger style Pop-up Pill State (Auto-expand on site entrance, then shrink to circle)
  const [showPill, setShowPill] = useState(false);

  useEffect(() => {
    // 1. Expand pill 900ms after entering website
    const expandTimer = setTimeout(() => {
      setShowPill(true);
    }, 900);

    // 2. Collapse smoothly back into circle after 3.8s display
    const collapseTimer = setTimeout(() => {
      setShowPill(false);
    }, 4500);

    // 3. Global listener to open, close, and toggle chat from header nav or external buttons
    const handleOpenExternal = () => setIsOpen(true);
    const handleCloseExternal = () => setIsOpen(false);
    const handleToggleExternal = () => setIsOpen((prev) => !prev);

    window.addEventListener("open-support-chat", handleOpenExternal);
    window.addEventListener("close-support-chat", handleCloseExternal);
    window.addEventListener("toggle-support-chat", handleToggleExternal);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(collapseTimer);
      window.removeEventListener("open-support-chat", handleOpenExternal);
      window.removeEventListener("close-support-chat", handleCloseExternal);
      window.removeEventListener("toggle-support-chat", handleToggleExternal);
    };
  }, []);

  // Broadcast chat status changes to header navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("support-chat-status", { detail: { isOpen } }));
    }
  }, [isOpen]);

  // Synchronized 10-Color RGB Engine (Self-sustaining)
  useEffect(() => {
    const RGB_PALETTE = [
      [16, 185, 129], [6, 182, 212], [14, 165, 233], [59, 130, 246],
      [99, 102, 241], [139, 92, 246], [217, 70, 239], [244, 63, 94],
      [249, 115, 22], [234, 179, 8]
    ];
    const totalDuration = 180;
    const count = RGB_PALETTE.length;
    const segment = totalDuration / count;
    let startTime = null;
    let animId;
    const updateRGB = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const sec = elapsed % totalDuration;
      const p = sec / segment;
      const idx = Math.floor(p) % count;
      const nextIdx = (idx + 1) % count;
      const f = p - Math.floor(p);
      const c1 = RGB_PALETTE[idx];
      const c2 = RGB_PALETTE[nextIdx];
      const r = Math.round(c1[0] + (c2[0] - c1[0]) * f);
      const g = Math.round(c1[1] + (c2[1] - c1[1]) * f);
      const b = Math.round(c1[2] + (c2[2] - c1[2]) * f);
      const root = document.documentElement;
      root.style.setProperty("--rgb-current", `rgb(${r}, ${g}, ${b})`);
      root.style.setProperty("--rgb-glow", `rgba(${r}, ${g}, ${b}, 0.5)`);
      root.style.setProperty("--rgb-border", `rgba(${r}, ${g}, ${b}, 0.45)`);
      root.style.setProperty("--rgb-subtle", `rgba(${r}, ${g}, ${b}, 0.12)`);
      animId = requestAnimationFrame(updateRGB);
    };
    animId = requestAnimationFrame(updateRGB);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Seamless PC Draggable States (No visible badge)
  const [pcOffset, setPcOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initX: 0, initY: 0 });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const handleMouseDownHeader = (e) => {
    if (typeof window === "undefined" || window.innerWidth < 640 || e.button !== 0) return;
    if (e.target.closest("button") || e.target.closest("input")) return;

    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: pcOffset.x,
      initY: pcOffset.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStartRef.current.startX;
      const deltaY = e.clientY - dragStartRef.current.startY;
      const nextX = dragStartRef.current.initX + deltaX;
      const nextY = dragStartRef.current.initY + deltaY;

      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const boxW = 390;
      const boxH = 550;
      const basePadding = 20;

      const minX = 10 - (winW - basePadding - boxW);
      const maxX = basePadding - 10;
      const minY = 10 - (winH - basePadding - boxH);
      const maxY = basePadding - 10;

      const clampedX = Math.max(minX, Math.min(maxX, nextX));
      const clampedY = Math.max(minY, Math.min(maxY, nextY));

      setPcOffset({ x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // 1. Check and Load 2-Hour TTL Auto-Delete
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const lastActiveAt = parsed.lastActiveAt || 0;
        const now = Date.now();

        // 2-hour inactivity check: if idle for > 2 hours, auto-purge completely!
        if (now - lastActiveAt > TWO_HOURS_MS) {
          localStorage.removeItem(STORAGE_KEY);
          setMessages([INITIAL_MESSAGE]);
        } else if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          setMessages(parsed.messages);
        }
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  }, []);

  // 2. Persist to localStorage with lastActiveAt timestamp
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            messages,
            lastActiveAt: Date.now(),
          })
        );
      } catch (err) {
        console.error("Failed to save chat:", err);
      }
    }
  }, [messages]);

  // Scroll to bottom smoothly when new message arrives
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Seamless auto re-focus whenever bot finishes typing (no mouse click needed)
  useEffect(() => {
    if (isOpen && !isTyping) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isTyping, isOpen]);

  // Manual Fresh Inbox / Clear Chat
  const handleResetChat = () => {
    if (confirm("আপনি কি সমস্ত চ্যাট হিস্ট্রি মুছে একদম ফ্রেশ ইনবক্স শুরু করতে চান?")) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
      setMessages([INITIAL_MESSAGE]);
    }
  };

  // Send message to backend Lisa AI bot
  const sendUserMessage = async (textToSend) => {
    const cleanText = (textToSend || "").trim();
    if (!cleanText || isTyping) return;

    // 2-Hour Inactivity check on send
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed.lastActiveAt && Date.now() - parsed.lastActiveAt > TWO_HOURS_MS) {
          localStorage.removeItem(STORAGE_KEY);
          setMessages([INITIAL_MESSAGE]);
        }
      }
    } catch (_) {}

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      text: cleanText,
      time: new Date().toLocaleTimeString("bn-BD", { hour: "numeric", minute: "numeric" }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage(""); // Clear input box
    setIsTyping(true);
    setTimeout(() => inputRef.current?.focus(), 50);

    try {
      // Prepare conversation history slice
      const history = updatedMessages.slice(-6).map((m) => ({
        role: m.role === "model" ? "model" : "user",
        text: m.text,
      }));

      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cleanText, history }),
      });

      const data = await res.json();
      const botReplyText =
        data.reply ||
        "জি ভাইয়া শুনতে পাচ্ছি! Mex Tanim Esports-এর স্লট বুকিং, পেমেন্ট বা প্রমোশন নিয়ে কীভাবে সাহায্য করতে পারি? 🌸";

      const botMsg = {
        id: `bot-${Date.now()}`,
        role: "model",
        text: botReplyText,
        time: new Date().toLocaleTimeString("bn-BD", { hour: "numeric", minute: "numeric" }),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Support chat error:", err);
      const fallbackMsg = {
        id: `bot-fallback-${Date.now()}`,
        role: "model",
        text: "ভাইয়া আমাদের পেমেন্ট নম্বর: 01611657757 (বিকাশ/নগদ Send Money)। সরাসরি স্লট বুক করতে সাইটের ফর্ম পূরণ করুন অথবা তানিম ভাইয়ের হোয়াটসঅ্যাপে যোগাযোগ করুন ❤️",
        time: new Date().toLocaleTimeString("bn-BD", { hour: "numeric", minute: "numeric" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    sendUserMessage(inputMessage);
  };

  // Quick suggestion chips: Direct Send immediately without sitting in the input box!
  const handleQuickAsk = (question) => {
    sendUserMessage(question);
  };

  return (
    <>
      {/* 0. Mobile-only Background Blur Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/65 backdrop-blur-md z-40 sm:hidden transition-opacity duration-300 animate-in fade-in"
          aria-label="Close chat backdrop"
        />
      )}

      <div className={`fixed right-4 sm:right-6 z-[999] select-none transition-all duration-300 ${
        isOpen ? "bottom-4 sm:bottom-5" : "bottom-[54px] sm:bottom-[60px]"
      }`}>
        {/* 1. FLOATING LAUNCHER BUTTON (META AI MESSENGER STYLE: PILL EXPANSION ON ENTRANCE & PC HOVER, CIRCLE OTHERWISE) */}
        {!isOpen && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
              setShowPill(false);
            }}
            style={{
              boxShadow: "0 0 25px var(--rgb-glow)",
              borderColor: "var(--rgb-border)",
            }}
            className={`group relative h-14 sm:h-16 rounded-full bg-[#0C0E12] transition-all duration-500 ease-in-out transform sm:hover:scale-105 border-2 p-1 sm:p-1.5 flex items-center cursor-pointer overflow-hidden ${
              showPill
                ? "w-[180px] sm:w-[195px]"
                : "w-14 sm:w-16 sm:hover:w-[195px]"
            }`}
            aria-label="Open 24/7 AI Support Chat"
          >
            {/* Subtle Synchronized RGB Glow Ring */}
            <div
              style={{
                background: "radial-gradient(circle, var(--rgb-glow) 0%, transparent 70%)",
              }}
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />

            {/* Circular Mascot Logo (Perfect 1:1 Geometric Proportions) */}
            <div
              style={{ borderColor: "var(--rgb-border)" }}
              className="relative w-11 h-11 sm:w-[50px] sm:h-[50px] rounded-full flex-shrink-0 overflow-hidden bg-black pointer-events-none border"
            >
              <img
                src="/gomon_ai.jpg"
                alt="AI Support"
                className="w-full h-full object-cover rounded-full pointer-events-none"
              />
            </div>

            {/* Pill Text: "Ask GOMON AI" (Expands on entrance & smoothly on PC hover) */}
            <div
              className={`flex items-center overflow-hidden transition-all duration-500 ease-in-out whitespace-nowrap pointer-events-none ${
                showPill
                  ? "max-w-[140px] opacity-100 pr-3.5 pl-2"
                  : "max-w-0 opacity-0 pr-0 pl-0 sm:group-hover:max-w-[140px] sm:group-hover:opacity-100 sm:group-hover:pr-3.5 sm:group-hover:pl-2"
              }`}
            >
              <span
                style={{ fontFamily: "'Cinzel Decorative', serif" }}
                className="text-xs sm:text-sm font-bold text-white tracking-wider leading-none select-none pointer-events-none"
              >
                Ask GOMON AI
              </span>
            </div>

            {unreadCount > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-white text-[#0C0E12] text-[11px] font-bold flex items-center justify-center animate-bounce shadow-lg z-10 pointer-events-none">
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {/* 2. CHAT WINDOW (100% RESPONSIVE + PC DRAGGABLE + SYNCHRONIZED RGB SHADE) */}
        {isOpen && (
          <div
            style={{
              ...(typeof window !== "undefined" && window.innerWidth >= 640
                ? { transform: `translate3d(${pcOffset.x}px, ${pcOffset.y}px, 0)` }
                : {}),
              boxShadow: isDragging
                ? "0 0 50px var(--rgb-glow)"
                : "0 0 35px var(--rgb-glow), 0 25px 50px rgba(0,0,0,0.85)",
              borderColor: "var(--rgb-border)",
            }}
            className={`w-[calc(100vw-32px)] sm:w-[390px] h-[550px] max-h-[85vh] rounded-[22px] bg-[#070806] sm:bg-[#0C0E12] border border-[#ffffff14] sm:border-[var(--rgb-border)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 transition-shadow ${
              isDragging ? "select-none" : ""
            }`}
          >
          {/* Top Chat Header (Draggable on PC - Seamlessly without any badges) */}
          <div
            onMouseDown={handleMouseDownHeader}
            className={`p-3.5 bg-[#10130e] sm:bg-[#14171E] border-b border-[#ffffff14] sm:border-[#232834] flex items-center justify-between select-none ${
              isDragging ? "cursor-grabbing" : "sm:cursor-grab"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                style={{
                  borderColor: "var(--rgb-current)",
                  boxShadow: "0 0 14px var(--rgb-glow)",
                }}
                className="relative w-10 h-10 rounded-full bg-[#070806] border-2 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm"
              >
                <img
                  src="/gomon_ai.jpg"
                  alt="Lisa AI"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                {/* Google Font: Cinzel Decorative for GOMON AI */}
                <link
                  rel="stylesheet"
                  href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&display=swap"
                  precedence="default"
                />
                <div
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                  className="text-[15px] font-bold tracking-wider text-[#f4f6f1] leading-tight"
                >
                  GOMON AI
                </div>
                <div className="text-[11px] text-[#8f968a] sm:text-neutral-400 font-sans flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A3A] inline-block animate-pulse" />
                  <span>GOMON HUB X MEX TANIM Tactical Support</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Reset / Fresh Inbox button (Professional Circular Style with RGB Sync) */}
              <button
                type="button"
                onClick={handleResetChat}
                title="চ্যাট হিস্ট্রি রিসেট করুন"
                style={{
                  borderColor: "var(--rgb-border)",
                }}
                className="group relative w-8 h-8 rounded-full bg-[#070806] sm:bg-[#0C0E12] hover:bg-[#151912] border border-[#ffffff14] sm:border-[var(--rgb-border)] flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="Reset chat history"
              >
                <RotateCcw
                  style={{ color: "var(--rgb-current)" }}
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-90 text-[#FF2A3A]"
                  strokeWidth={2.2}
                />
              </button>

              {/* Close Button (Professional Circular Style) */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="চ্যাট বন্ধ করুন"
                className="group relative w-8 h-8 rounded-full bg-[#070806] sm:bg-[#0C0E12] hover:bg-red-500/15 border border-[#ffffff14] sm:border-[#232834] hover:border-red-500/40 text-[#8f968a] hover:text-red-400 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[16px] px-3.5 py-2.5 text-xs leading-relaxed transition-all shadow-sm ${
                      isUser
                        ? "bg-white text-[#070806] font-semibold rounded-br-none shadow-md"
                        : "bg-[#10130e] sm:bg-[#14171E] border border-[#ffffff14] sm:border-[#232834] text-[#f4f6f1] sm:text-neutral-200 rounded-bl-none whitespace-pre-wrap"
                    }`}
                  >
                    {renderFormattedMessage(msg.text)}
                  </div>
                  <span className="text-[10px] text-[#8f968a] sm:text-neutral-500 mt-1 px-1 font-mono">
                    {msg.time}
                  </span>
                </div>
              );
            })}

            {/* Smooth Animated Typing Indicator with Natural Text Periods */}
            {isTyping && (
              <div className="flex flex-col items-start">
                <style>{`
                  @keyframes typingDotHop {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
                    40% { transform: translateY(-3px); opacity: 1; }
                  }
                  .typing-dot-1 { display: inline-block; animation: typingDotHop 1.2s infinite ease-in-out 0s; }
                  .typing-dot-2 { display: inline-block; animation: typingDotHop 1.2s infinite ease-in-out 0.2s; }
                  .typing-dot-3 { display: inline-block; animation: typingDotHop 1.2s infinite ease-in-out 0.4s; }
                `}</style>
                <div className="bg-[#10130e] sm:bg-[#14171E] border border-[#ffffff14] sm:border-[#232834] text-[#FF2A3A] px-3.5 py-2 rounded-[16px] rounded-bl-none text-xs font-mono flex items-center shadow-sm">
                  <span>Typing</span>
                  <span className="inline-flex tracking-wider ml-0.5 font-bold select-none">
                    <span className="typing-dot-1">.</span>
                    <span className="typing-dot-2">.</span>
                    <span className="typing-dot-3">.</span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Suggestions */}
          {messages.length <= 2 && !isTyping && (
            <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
              {[
                "পেমেন্ট নম্বর দিন",
                "স্লটের নিয়ম কী?",
                "ভিডিও প্রমোশন প্যাকেজ",
                "সোশ্যাল লিংকসমূহ",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleQuickAsk(chip)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#10130e] sm:bg-[#14171E] border border-[#ffffff14] sm:border-[#232834] hover:border-[#FF2A3A]/60 text-[#8f968a] hover:text-[#FF2A3A] text-[11px] font-mono transition-all flex items-center gap-1.5 flex-shrink-0 shadow-sm"
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#FF2A3A]" />
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={handleSendMessage}
            data-chat-support="true"
            className="p-3 bg-[#10130e] sm:bg-[#14171E] border-t border-[#ffffff14] sm:border-[#232834] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isTyping ? "লিসা উত্তর দিচ্ছে..." : "মেসেজ লিখুন..."}
              className="flex-1 bg-[#070806] sm:bg-[#0C0E12] border border-[#ffffff14] sm:border-[#232834] rounded-[12px] px-3.5 py-2 text-xs text-[#f4f6f1] placeholder-[#626959] focus:outline-none focus:border-[#FF2A3A]"
            />

            <button
              type="submit"
              disabled={isTyping || !inputMessage.trim()}
              className="w-9 h-9 rounded-[12px] bg-[#FF2A3A] hover:bg-[#E01E2E] text-[#070806] font-bold flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-[0_0_15px_rgba(255,42,58,0.3)]"
              title="মেসেজ পাঠান"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  </>
);
}
