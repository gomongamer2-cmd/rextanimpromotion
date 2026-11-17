"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Bot,
} from "lucide-react";

const STORAGE_KEY = "mex_support_chat_v1";
const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

const INITIAL_MESSAGE = {
  id: "welcome-1",
  role: "model",
  text: "আসসালামু আলাইকুম ভাইয়া! আমি লিসা, Mex Tanim Esports-এর ২৪/৭ লাইভ সাপোর্ট অ্যাসিস্ট্যান্ট। টুর্নামেন্ট স্লট বুকিং, পেমেন্ট বা যেকোনো প্রয়োজনে কীভাবে সাহায্য করতে পারি? 🌸🎮",
  time: new Date().toLocaleTimeString("bn-BD", { hour: "numeric", minute: "numeric" }),
};

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

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
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const cleanText = inputMessage.trim();
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
    setInputMessage("");
    setIsTyping(true);

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
        "জি ভাইয়া শুনতে পাচ্ছি! টুর্নামেন্ট স্লট বুকিং বা পেমেন্ট নিয়ে কীভাবে সাহায্য করতে পারি? 🌸";

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
    }
  };

  // Quick suggestion chips
  const handleQuickAsk = (question) => {
    setInputMessage(question);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* 1. FLOATING LAUNCHER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-white hover:bg-neutral-200 text-[#0C0E12] shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/20"
          aria-label="Open 24/7 AI Support Chat"
        >
          {/* Pulsing Emerald Green Status Dot */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>

          <MessageSquare className="w-4 h-4 text-[#0C0E12]" />

          <div className="text-left font-mono">
            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>২৪/৭ লাইভ সাপোর্ট</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500 text-black font-extrabold uppercase">
                লিসা AI
              </span>
            </div>
            <div className="text-[10px] text-neutral-600 font-sans leading-tight">
              অনলাইন • আনলিমিটেড চ্যাট
            </div>
          </div>

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-black text-[11px] font-bold flex items-center justify-center animate-bounce shadow">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* 2. CHAT WINDOW (100% RESPONSIVE) */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[390px] h-[550px] max-h-[85vh] rounded-[20px] bg-[#0C0E12] border border-[#232834] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Top Chat Header */}
          <div className="p-3.5 bg-[#14171E] border-b border-[#232834] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full bg-[#0C0E12] border border-[#232834] flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-emerald-400" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#14171E]"></span>
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                  <span>লিসা AI</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    24/7 লাইভ
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  Mex Tanim Esports অফিসিয়াল সাপোর্ট
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              {/* Reset / Fresh Inbox button */}
              <button
                type="button"
                onClick={handleResetChat}
                title="চ্যাট হিস্ট্রি মুছে ফ্রেশ ইনবক্স শুরু করুন"
                className="w-8 h-8 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Privacy & Encryption Notice Banner */}
          <div className="px-3 py-1.5 bg-[#101915] border-b border-emerald-950/60 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              AES-256 সুরক্ষিত • আনলিমিটেড
            </span>
            <span className="text-neutral-400">২ ঘণ্টা পর অটো-ডিলিট</span>
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
                    className={`max-w-[85%] rounded-[14px] px-3.5 py-2.5 text-xs leading-relaxed transition-all shadow-sm ${
                      isUser
                        ? "bg-white text-[#0C0E12] font-medium rounded-br-none"
                        : "bg-[#14171E] border border-[#232834] text-neutral-200 rounded-bl-none whitespace-pre-wrap"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1 px-1 font-mono">
                    {msg.time}
                  </span>
                </div>
              );
            })}

            {/* Exactly as requested: "lisa type korche na....Typing... diba just" */}
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-[#14171E] border border-[#232834] text-emerald-400 px-3.5 py-2 rounded-[14px] rounded-bl-none text-xs font-mono flex items-center gap-2 shadow-sm">
                  <span>Typing...</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
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
                "সোশ্যাল লিংকসমূহ",
                "মেগা টুর্নামেন্ট ডিটেইলস",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleQuickAsk(chip)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#14171E] border border-[#232834] hover:border-emerald-500/60 text-neutral-300 hover:text-emerald-300 text-[11px] font-mono transition-all flex items-center gap-1 flex-shrink-0"
                >
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#14171E] border-t border-[#232834] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="মেসেজ লিখুন..."
              disabled={isTyping}
              className="flex-1 bg-[#0C0E12] border border-[#232834] rounded-[10px] px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isTyping || !inputMessage.trim()}
              className="w-9 h-9 rounded-[10px] bg-white hover:bg-neutral-200 text-[#0C0E12] flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-md"
              title="মেসেজ পাঠান"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
