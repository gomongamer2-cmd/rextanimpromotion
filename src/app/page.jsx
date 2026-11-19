"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Smartphone,
  Radio,
  Users2,
  Calendar,
  Clock,
  QrCode,
  ShieldAlert,
  Send,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check,
  Video,
  Layers,
  FileText,
  CreditCard,
  AlertCircle,
  Eye,
  TrendingUp,
  Award,
  ShieldCheck,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Megaphone
} from "lucide-react";
import SupportChat from "../components/SupportChat";

// 3 Official Target Categories (Standard Titles, No Extra Text)
const CATEGORIES = [
  {
    id: "tournament-app",
    title: "Tournament App",
  },
  {
    id: "whatsapp-channel",
    title: "WhatsApp Channel",
  },
  {
    id: "whatsapp-group",
    title: "WhatsApp Group",
  },
];

// Exact 10-Tier Pricing & Perks Matrix from Business Specifications (Bengali)
const VIDEO_TIERS = {
  0: {
    videos: 0,
    price: 0,
    bioDays: 0,
    perks: [
      "১ থেকে ১০টি ভিডিও প্যাকেজ বেছে নিন",
      "প্যাকেজ অনুযায়ী বায়ো লিংক সুবিধা",
      "ফুল HD 1080p 60FPS ভিডিও পাবলিকেশন",
      "Mex Tanim Gaming অফিশিয়াল সাপোর্ট",
    ],
  },
  1: {
    videos: 1,
    price: 1000,
    bioDays: 1,
    perks: [
      "১টি ডেডিকেটেড ভিডিও পাবলিকেশন",
      "১ দিন গ্রুপ লিংক বায়ো তে থাকবে",
      "বেস্ট কোয়ালিটি (Best Quality)",
    ],
  },
  2: {
    videos: 2,
    price: 1500,
    bioDays: 2,
    perks: [
      "২টি ডেডিকেটেড ভিডিও পাবলিকেশন",
      "২ দিন গ্রুপ লিংক বায়ো তে থাকবে",
      "বেস্ট কোয়ালিটি (Best Quality)",
      "এডমিন সাপোর্ট (Admin Support)",
    ],
  },
  3: {
    videos: 3,
    price: 2000,
    bioDays: 3,
    perks: [
      "৩টি ডেডিকেটেড ভিডিও পাবলিকেশন",
      "৩ দিন গ্রুপ লিংক বায়ো তে থাকবে",
      "বেস্ট কোয়ালিটি (Best Quality)",
      "Mex Tanim Gaming পার্সোনাল সাপোর্ট",
    ],
  },
  4: {
    videos: 4,
    price: 2500,
    bioDays: 4,
    perks: [
      "৪টি ডেডিকেটেড ভিডিও পাবলিকেশন",
      "৪ দিন গ্রুপ লিংক বায়ো তে থাকবে",
      "বেস্ট কোয়ালিটি (Best Quality)",
      "Mex Tanim Gaming পার্সোনাল সাপোর্ট",
      "টুর্নামেন্ট সাপোর্ট (Tournament Support)",
    ],
  },
  5: {
    videos: 5,
    price: 3000,
    bioDays: 5,
    perks: [
      "৫টি ডেডিকেটেড ভিডিও পাবলিকেশন",
      "৫ দিন গ্রুপ লিংক বায়ো তে থাকবে",
      "বেস্ট কোয়ালিটি (Best Quality)",
      "Mex Tanim Gaming পার্সোনাল সাপোর্ট",
      "টুর্নামেন্ট সাপোর্ট (Tournament Support)",
      "অরগানাইজেশন আইডিয়া শেয়ার (Org Idea Share)",
    ],
  },
  6: {
    videos: 6,
    price: 3500,
    bioDays: 6,
    perks: [
      "৬টি ডেডিকেটেড ভিডিও পাবলিকেশন",
      "৬ দিন গ্রুপ লিংক বায়ো তে থাকবে",
      "বেস্ট কোয়ালিটি ও বেস্ট ভিউজ (Best Views)",
      "Mex Tanim Gaming পার্সোনাল সাপোর্ট",
      "টুর্নামেন্ট সাপোর্ট ও অরগানাইজেশন আইডিয়া শেয়ার",
    ],
  },
  7: {
    videos: 7,
    price: 4000,
    bioDays: 7,
    perks: [
      "৭টি ডেডিকেটেড ভিডিও পাবলিকেশন",
      "৭ দিন গ্রুপ লিংক বায়ো তে থাকবে",
      "বেস্ট কোয়ালিটি ও বেস্ট ভিউজ (Best Views)",
      "Mex Tanim Gaming পার্সোনাল ও টুর্নামেন্ট সাপোর্ট",
      "অরগানাইজেশন আইডিয়া শেয়ার (Org Idea Share)",
      "টিয়ার-১ টিম সাপোর্ট (T1 Teams Support)",
    ],
  },
  8: {
    videos: 8,
    price: 4500,
    bioDays: 8,
    perks: [
      "৮টি ডেডিকেটেড ভিডিও পাবলিকেশন",
      "৮ দিন গ্রুপ লিংক বায়ো তে থাকবে",
      "বেস্ট কোয়ালিটি ও বেস্ট ভিউজ (Best Views)",
      "Mex Tanim Gaming পার্সোনাল ও টুর্নামেন্ট সাপোর্ট",
      "অরগানাইজেশন আইডিয়া শেয়ার (Org Idea Share)",
      "টিয়ার-১ টিম সাপোর্ট (T1 Teams Support)",
      "ভি-ব্যাজ টিম সাপোর্ট (V Badge Team Support)",
    ],
  },
  9: {
    videos: 9,
    price: 4700,
    bioDays: 9,
    perks: [
      "৯টি ডেডিকেটেড ভিডিও পাবলিকেশন",
      "৯ দিন গ্রুপ লিংক বায়ো তে থাকবে",
      "বেস্ট কোয়ালিটি ও বেস্ট ভিউজ (Best Views)",
      "Mex Tanim Gaming পার্সোনাল ও টুর্নামেন্ট সাপোর্ট",
      "অরগানাইজেশন আইডিয়া শেয়ার (Org Idea Share)",
      "T1 Teams ও V Badge Team সাপোর্ট",
      "প্রো-ব্যাজ টিম সাপোর্ট (Pro Badge Team Support)",
    ],
  },
  10: {
    videos: 10,
    price: 5000,
    bioDays: 10,
    perks: [
      "১০টি ডেডিকেটেড ভিডিও পাবলিকেশন",
      "১০ দিন গ্রুপ লিংক বায়ো তে থাকবে",
      "বেস্ট কোয়ালিটি ও বেস্ট ভিউজ (Best Views)",
      "Mex Tanim Gaming পার্সোনাল ও টুর্নামেন্ট সাপোর্ট",
      "অরগানাইজেশন আইডিয়া শেয়ার (Org Idea Share)",
      "T1 Teams, V Badge Team ও Pro Badge Team সাপোর্ট",
      "SG Server ড্রোন সাপোর্ট (SG Server Drone Support)",
      "Mex Tanim Esports Org-এর পক্ষ থেকে পার্মানেন্ট সাপোর্ট",
    ],
  },
};

const WIZARD_STEPS = [
  { id: 1, label: "প্যাকেজ নির্বাচন", icon: Layers },
  { id: 2, label: "ক্লায়েন্ট তথ্য", icon: FileText },
  { id: 3, label: "তারিখ নির্বাচন", icon: Calendar },
  { id: 4, label: "পেমেন্ট ও অর্ডার", icon: CreditCard },
];

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Selections
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[2]); // Default: WhatsApp Group
  const [videoCount, setVideoCount] = useState(0);
  const [isNumberPickerOpen, setIsNumberPickerOpen] = useState(false);
  const [isTierListOpen, setIsTierListOpen] = useState(false);
  const [isPlatformSelectorOpen, setIsPlatformSelectorOpen] = useState(false);
  const [isBarSlidingOut, setIsBarSlidingOut] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handlePlatformBarClick = () => {
    if (isBarSlidingOut || isPlatformSelectorOpen) return;
    setIsBarSlidingOut(true);
    setTimeout(() => {
      setIsPlatformSelectorOpen(true);
    }, 2000);
  };

  // Admin-Published Dates state
  const [availableDates, setAvailableDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);

  // Form Fields
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [tournamentDetails, setTournamentDetails] = useState("");
  const [orgLogoLink, setOrgLogoLink] = useState("");
  const [kycVerificationLink, setKycVerificationLink] = useState("");
  const [trxId, setTrxId] = useState("");
  const [paymentProvider, setPaymentProvider] = useState("bKash Personal");

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const activeTier = VIDEO_TIERS[videoCount] || VIDEO_TIERS[0];
  const [paymentSettings, setPaymentSettings] = useState({
    bkashNumber: "01611657757",
    nagadNumber: "01611657757",
    rocketNumber: "01611657757",
    whatsappNumber: "8801611657757",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.settings) {
          setPaymentSettings(json.settings);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }
    loadSettings();
  }, []);

  const WHATSAPP_NUMBER = paymentSettings.whatsappNumber || "8801611657757";

  const getActivePaymentNumber = () => {
    if (paymentProvider.toLowerCase().includes("nagad")) return paymentSettings.nagadNumber || "01611657757";
    if (paymentProvider.toLowerCase().includes("rocket")) return paymentSettings.rocketNumber || "01611657757";
    return paymentSettings.bkashNumber || "01611657757";
  };

  // Global Synchronized 3-Minute 10-Color RGB Engine (Master Clock)
  useEffect(() => {
    const RGB_PALETTE = [
      [16, 185, 129],  // 0: Neon Emerald
      [6, 182, 212],   // 1: Cyan
      [14, 165, 233],  // 2: Sky Blue
      [59, 130, 246],  // 3: Electric Blue
      [99, 102, 241],  // 4: Indigo
      [139, 92, 246],  // 5: Violet
      [217, 70, 239],  // 6: Fuchsia / Magenta
      [244, 63, 94],   // 7: Rose
      [249, 115, 22],  // 8: Coral Orange
      [234, 179, 8],   // 9: Golden Amber
    ];
    const totalDuration = 180; // 3 minutes
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

  // Fetch admin-published available dates
  useEffect(() => {
    let isMounted = true;
    async function fetchAvailableDates() {
      setLoadingDates(true);
      try {
        const res = await fetch("/api/dates");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.dates)) {
          setAvailableDates(json.dates);
          if (json.dates.length > 0) {
            setSelectedDate(json.dates[0].date);
          }
        }
      } catch (err) {
        console.error("Failed to load dates:", err);
      } finally {
        if (isMounted) setLoadingDates(false);
      }
    }
    fetchAvailableDates();
    return () => {
      isMounted = false;
    };
  }, []);

  // PC Keyboard Navigation: Enter = Next, Shift + Enter = Multiline newline in text areas
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shift + Enter: allow natural newline in any text field
      if (e.shiftKey) return;

      if (e.key === "Enter") {
        // If user is inside AI SupportChat, let the chat handle its own Enter
        if (e.target && e.target.closest && e.target.closest("[data-chat-support]")) {
          return;
        }

        if (currentStep === 1) {
          if (videoCount > 0) {
            e.preventDefault();
            setCurrentStep(2);
          } else {
            e.preventDefault();
            setIsNumberPickerOpen(true);
          }
        } else if (currentStep === 2) {
          if (clientName.trim() && phone.trim() && tournamentDetails.trim()) {
            e.preventDefault();
            setCurrentStep(3);
          }
        } else if (currentStep === 3) {
          if (selectedDate) {
            e.preventDefault();
            setCurrentStep(4);
          }
        } else if (currentStep === 4) {
          if (trxId.trim() && clientName.trim() && phone.trim() && tournamentDetails.trim()) {
            e.preventDefault();
            handleBookingSubmit(e);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, videoCount, clientName, phone, tournamentDetails, selectedDate, trxId]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError("");

    if (!clientName || !phone || !tournamentDetails || !trxId) {
      setSubmissionError("Please fill in all mandatory fields, including tournament details and TrxID.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Submit to Next.js + MongoDB API
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          phone,
          category: selectedCategory.title,
          videoCount,
          totalPrice: activeTier.price,
          bioLinkDays: activeTier.bioDays,
          selectedDate,
          selectedTimeSlot: "Official Day",
          orgLogoLink,
          tournamentDetails,
          kycVerificationLink,
          paymentMethod: paymentProvider,
          trxId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setSubmissionError(
          result.error || "This slot was just reserved by another client. Please select another slot."
        );
        setSubmitting(false);
        return;
      }

      const confirmedOrderId = result.orderId || `MEX-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderId(confirmedOrderId);
      setSubmitted(true);

      // 2. Format Official WhatsApp Transmission
      const message = `*MEX TANIM ESPORTS — OFFICIAL PROMOTION INTAKE*
---------------------------------------
*Invoice ID:* #${confirmedOrderId}
*Organization / Client:* ${clientName}
*Phone / WhatsApp:* ${phone}
*Target Medium:* ${selectedCategory.title}
*Video Tier:* ${videoCount} Video(s) [${activeTier.bioDays} Days Bio Link]
*Total Payable:* BDT ${activeTier.price} (Full Advance)
*Promotion Start Date:* ${selectedDate}
*Tournament Details:* ${tournamentDetails}
*Org Logo Link:* ${orgLogoLink || "Submitted via Drive"}
*KYC (NID / Photo Link):* ${kycVerificationLink || "Provided directly"}
*Payment Account:* ${paymentProvider}
*Payment TrxID:* ${trxId}
---------------------------------------
Verified via Mex Tanim Automated Engine`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    } catch (err) {
      console.error("Booking error:", err);
      setSubmissionError("Network error transmitting booking. Please check connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden flex flex-col justify-between bg-[#0C0E12] text-[#EDEDED]">
      {/* Top Navigation */}
      <header className="border-b border-[#232834] bg-[#14171E] flex-shrink-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Mex Tanim Esports Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5 leading-tight">
                <span>MEX TANIM</span>
                <span className="text-neutral-400 font-normal text-xs sm:text-sm">
                  Promotional Platform
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 font-mono tracking-normal leading-tight mt-0.5">
                Official Tournament &amp; Media Promotion
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-2 flex flex-col justify-center gap-2 sm:gap-3">
        {/* Sleek Balanced 1-2-3-4 Stepper (Proportional width, thin segmented lines between nodes, clean numbers) */}
        <div className="w-full max-w-2xl sm:max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNum, idx) => {
              const isCurrent = currentStep === stepNum;
              const isCompleted = currentStep > stepNum;
              const isClickable = isCompleted || stepNum < currentStep;

              return (
                <React.Fragment key={stepNum}>
                  {/* Clean Number Node (All 4 nodes exactly same size, no scaling distortion) */}
                  <button
                    type="button"
                    disabled={!isClickable && !isCurrent}
                    onClick={() => {
                      if (isClickable) setCurrentStep(stepNum);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center transition-colors duration-200 shrink-0 select-none ${
                      isCurrent
                        ? "stepper-rgb-active text-black cursor-default ring-2 ring-white/20"
                        : isCompleted
                        ? "bg-[#14171E] stepper-rgb-completed border cursor-pointer hover:border-neutral-400"
                        : "bg-[#0C0E12] border border-[#232834] text-neutral-500 opacity-60 cursor-not-allowed"
                    }`}
                    aria-label={`ধাপ ${stepNum}`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    ) : (
                      stepNum
                    )}
                  </button>

                  {/* Thin Connector Line strictly BETWEEN nodes */}
                  {idx < 3 && (
                    <div
                      className={`flex-1 h-[1.5px] mx-2.5 sm:mx-4 transition-all duration-500 ${
                        currentStep > idx + 1
                          ? "stepper-rgb-line"
                          : "bg-[#232834]"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* STEP 1: Scope & Volume (Promotion Medium & Video Package) */}
        {currentStep === 1 && (
          <section className="rounded-[16px] border border-[#232834] bg-[#14171E] p-4 sm:p-5 min-h-[520px] lg:h-[530px] flex flex-col justify-between">
            <div className="space-y-3">
              {/* Step Header */}
              <div className="border-b border-[#232834] pb-2">
                <div className="text-xs font-mono tracking-wide font-semibold rgb-text">
                  অফিশিয়াল প্রমোশন প্যাকেজ
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-white mt-0.5">
                  Choose a Platform & Package
                </h2>
              </div>

              {/* 1. Promotion Medium Selection Row (Zero extra space, exact same height, smooth 2s slide-to-right) */}
              <div className="relative overflow-hidden rounded-[8px]">
                {/* The 3 Medium Cards (Base layer, immediately revealed as bar slides right) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className="flex items-center gap-2.5 p-2.5 rounded-[8px] border border-[#232834] bg-[#0C0E12] hover:border-neutral-700 hover:bg-[#11141B] text-left transition-all cursor-pointer"
                      >
                        <div
                          className={`w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-emerald-500 text-black font-bold"
                              : "bg-[#14171E] text-neutral-400 border border-[#232834]"
                          }`}
                        >
                          {/* REAL BRAND ICONS */}
                          {cat.id === "tournament-app" && (
                            <Gamepad2 className={`w-3.5 h-3.5 ${isSelected ? "text-black" : "text-emerald-400"}`} />
                          )}
                          {cat.id === "whatsapp-channel" && (
                            <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${isSelected ? "fill-black" : "fill-[#25D366]"}`}>
                              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.4 1.01 2.57.13.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z"/>
                            </svg>
                          )}
                          {cat.id === "whatsapp-group" && (
                            <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${isSelected ? "fill-black" : "fill-[#25D366]"}`}>
                              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.4 1.01 2.57.13.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z"/>
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-semibold text-white truncate">
                            {cat.title}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
                            <Check className="w-2.5 h-2.5" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Overlay Cover Bar (Slides left-to-right & turns invisible over 2 seconds) */}
                {!isPlatformSelectorOpen && (
                  <button
                    type="button"
                    onClick={handlePlatformBarClick}
                    style={{
                      transition: "transform 2s cubic-bezier(0.25, 1, 0.5, 1)",
                    }}
                    className={`absolute inset-0 z-10 w-full h-full rounded-[8px] border border-[#232834] bg-[#0C0E12] px-3.5 flex items-center justify-between shadow-sm select-none cursor-pointer ${
                      isBarSlidingOut
                        ? "translate-x-[105%] pointer-events-none"
                        : "translate-x-0 hover:border-emerald-500/70 hover:bg-[#11141B]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-[6px] bg-[#14171E] border border-[#232834] group-hover:border-emerald-500/50 flex items-center justify-center shrink-0 text-emerald-400 transition-colors">
                        <span className="font-bold text-sm leading-none select-none">彡</span>
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors leading-normal">
                          আপনি যেটি প্রমোশন করতে চান সেটি সিলেক্ট করুন
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-400 group-hover:text-emerald-400 transition-colors shrink-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:inline-block font-semibold">
                        Select Platform
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#14171E] border border-[#232834] flex items-center justify-center">
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* 2. Interactive Package Selection & Specifications Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
                {/* LEFT: Video Package Direct 1-10 Grid (5 Cols) */}
                <div className="lg:col-span-5 rounded-[10px] border border-[#232834] bg-[#0C0E12] p-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Clickable Header: Toggle Number Options */}
                    <button
                      type="button"
                      onClick={() => setIsNumberPickerOpen(!isNumberPickerOpen)}
                      className="w-full flex items-center justify-between border-b border-[#232834] pb-1.5 cursor-pointer group select-none text-left"
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 group-hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                        <Layers className="w-3 h-3 text-neutral-400 group-hover:text-emerald-400" />
                        ভিডিও প্যাকেজ বেছে নিন
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                          {videoCount}টি নির্বাচিত
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                            isNumberPickerOpen ? "rotate-180 text-emerald-400" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Quick 10-Button Numeric Grid (Appears on click) */}
                    {isNumberPickerOpen && (
                      <div className="grid grid-cols-5 gap-1 animate-in fade-in zoom-in-95 duration-200 py-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                          const isCurrent = videoCount === num;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setVideoCount(num)}
                              className={`py-1.5 rounded-[5px] text-xs font-mono font-bold transition-all text-center border cursor-pointer ${
                                isCurrent
                                  ? "bg-emerald-500 text-black border-emerald-400 shadow-md font-black"
                                  : "bg-[#14171E] border-[#232834] text-neutral-300 hover:border-neutral-600 hover:text-white"
                              }`}
                            >
                              {num < 10 ? `0${num}` : num}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Selected Quantity (ALWAYS PRESENT) */}
                    <div className="p-2.5 rounded-[6px] bg-[#14171E] border border-[#232834] flex items-center justify-between text-xs">
                      <span className="text-neutral-400 font-mono">Quantity:</span>
                      <span className="text-white font-bold font-mono">{videoCount}টি ভিডিও</span>
                    </div>
                  </div>

                  {/* Plan Fee */}
                  <div className="mt-2 pt-2 border-t border-[#232834] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">Plan Fee</div>
                      <div className="text-base font-black text-white font-mono mt-0.5">BDT- {activeTier.price}</div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Clean Specifications & Perks Sheet (7 Cols) */}
                <div className="lg:col-span-7 rounded-[10px] border border-[#232834] bg-[#0C0E12] p-3 sm:p-3.5 flex flex-col justify-between space-y-2">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#232834] pb-1.5">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 rgb-text">
                          <Award className="w-3 h-3 text-emerald-400" />
                          Plan Specifications
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">
                          {videoCount > 0
                            ? `${videoCount}টি ভিডিও প্রমোশন প্যাকেজ (${selectedCategory.title})`
                            : `প্রমোশন প্যাকেজ স্পেসিফিকেশন (${selectedCategory.title})`}
                        </h3>
                      </div>
                    </div>

                    {/* All Specifications as Clean Tick-Marked Text (Zero Boxes) */}
                    <div className="py-2.5 space-y-2 max-h-[185px] overflow-y-auto pr-1">
                      <div className="flex items-center gap-2 text-xs text-neutral-200">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                        <span>প্রমোশন মাধ্যম: <strong className="text-white">{selectedCategory.title}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-200">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                        <span>ভিডিও রেজোলিউশন: <strong className="text-white">1080p 60FPS Full HD</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-200">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                        <span>লাইফটাইম স্থায়িত্ব: <strong className="text-white">স্থায়ী আর্কাইভ গ্যারান্টি</strong></span>
                      </div>

                      {activeTier.perks.map((perk, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-neutral-200">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Notice */}
                  <div className="pt-1.5 border-t border-[#232834] flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-mono text-[9px]">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      ১০০% ফুল অ্যাডভান্স পেমেন্ট সম্পন্ন করার পরই স্লট প্রস্তুত হবে
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold text-[10px] shrink-0">
                      স্লট বুকিং প্রস্তুত
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1 Actions (INSIDE THE BOX AT THE BOTTOM) */}
            <div className="pt-2.5 border-t border-[#232834] flex items-center justify-between mt-auto">
              <div className="text-xs font-mono text-neutral-400">
                নির্বাচিত: {videoCount}টি ভিডিও ({selectedCategory.title}) — BDT- {activeTier.price}
              </div>
              <button
                type="button"
                disabled={videoCount === 0}
                onClick={() => {
                  if (videoCount > 0) setCurrentStep(2);
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-md ${
                  videoCount === 0
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50"
                    : "bg-white hover:bg-neutral-200 text-[#0C0E12] cursor-pointer"
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 2: Client & Tournament Intake Information */}
        {currentStep === 2 && (
          <section className="rounded-[16px] border border-[#232834] bg-[#14171E] p-4 sm:p-5 min-h-[520px] lg:h-[530px] flex flex-col justify-between">
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b border-[#232834] pb-3">
                <div className="text-xs font-mono tracking-wide font-semibold rgb-text">
                  ক্লায়েন্ট ও টুর্নামেন্ট বিবরণ
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mt-0.5">
                  আপনার প্রতিষ্ঠান ও টুর্নামেন্টের প্রয়োজনীয় তথ্য দিন
                </h2>
              </div>

              {/* Form Fields Card */}
              <div className="border border-[#232834] rounded-[10px] bg-[#0C0E12] p-4 sm:p-5 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1">
                      অরগানাইজেশন বা ক্লায়েন্টের নাম *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: BD Esports Org"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-[#14171E] border border-[#232834] rounded-[8px] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1">
                      অ্যাক্টিভ হোয়াটসঅ্যাপ নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="যেমন: +880 1700 000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#14171E] border border-[#232834] rounded-[8px] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    কোন কোন টুর্নামেন্ট চালাবেন (গেম, টুর্নামেন্ট নাম ও ফরম্যাট) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="যেমন: Free Fire Squad Cup / PUBG Mobile Daily Scrims (প্রাইজপুল ও এন্ট্রি ফি উল্লেখ করতে পারেন)"
                    value={tournamentDetails}
                    onChange={(e) => setTournamentDetails(e.target.value)}
                    className="w-full bg-[#14171E] border border-[#232834] rounded-[8px] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1">
                      অরগানাইজেশন লোগো বা ড্রাইভ লিংক (ঐচ্ছিক)
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={orgLogoLink}
                      onChange={(e) => setOrgLogoLink(e.target.value)}
                      className="w-full bg-[#14171E] border border-[#232834] rounded-[8px] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1">
                      NID / জন্মনিবন্ধন ও ছবির ড্রাইভ লিংক (ঐচ্ছিক)
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={kycVerificationLink}
                      onChange={(e) => setKycVerificationLink(e.target.value)}
                      className="w-full bg-[#14171E] border border-[#232834] rounded-[8px] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Quick Notice */}
                <div className="pt-2 border-t border-[#232834] flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    সকল তথ্য মেক্স তানিম অফিশিয়াল ডাটাবেজে সম্পূর্ণ গোপনীয় ও সুরক্ষিত থাকবে
                  </span>
                  <span>* চিহ্নিত ঘরগুলো আবশ্যক</span>
                </div>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="pt-3 border-t border-[#232834] flex items-center justify-between mt-auto">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-600 text-neutral-300 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="button"
                disabled={!clientName.trim() || !phone.trim() || !tournamentDetails.trim()}
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: Admin-Published Promotion Date Selection (No Hourly Slots) */}
        {currentStep === 3 && (
          <section className="rounded-[16px] border border-[#232834] bg-[#14171E] p-4 sm:p-5 min-h-[520px] lg:h-[530px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1 border-b border-[#232834] pb-3">
                <div className="text-xs font-mono tracking-wide font-semibold rgb-text">
                  প্রচারণার সময়সূচি
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mt-0.5">
                  প্রমোশন প্রচারণার শুরুর তারিখ বেছে নিন
                </h2>
                <p className="text-xs text-neutral-400">
                  অ্যাডমিন কর্তৃক নির্ধারিত সক্রিয় তারিখগুলো থেকে আপনার প্রমোশন শুরুর দিনটি নির্বাচন করুন।
                </p>
              </div>

              {/* Date Selection Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    সক্রিয় প্রমোশন তারিখসমূহ
                  </label>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {loadingDates ? "লোড হচ্ছে..." : `${availableDates.length}টি তারিখ উন্মুক্ত রয়েছে`}
                  </span>
                </div>

                {loadingDates ? (
                  <div className="p-8 rounded-[12px] bg-[#0C0E12] border border-[#232834] text-center text-xs text-neutral-400 font-mono">
                    অ্যাডমিন প্রকাশিত তারিখ লোড হচ্ছে...
                  </div>
                ) : availableDates.length === 0 ? (
                  <div className="p-8 rounded-[12px] bg-[#0C0E12] border border-[#232834] text-center space-y-2">
                    <Calendar className="w-8 h-8 text-neutral-600 mx-auto" />
                    <div className="text-sm font-semibold text-white">বর্তমানে কোনো প্রমোশন তারিখ উন্মুক্ত নেই</div>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      নতুন স্লট ও স্পেশাল তারিখ জানতে সরাসরি অ্যাডমিন ডেস্কে যোগাযোগ করুন।
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableDates.map((item) => {
                      const isSelected = selectedDate === item.date;
                      return (
                        <button
                          key={item.date}
                          type="button"
                          onClick={() => setSelectedDate(item.date)}
                          className={`p-3.5 rounded-[10px] border text-left transition-all flex flex-col justify-between h-[105px] cursor-pointer ${
                            isSelected
                              ? "border-emerald-500 bg-[#14231E] text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                              : "border-[#232834] bg-[#0C0E12] text-neutral-300 hover:border-neutral-600 hover:bg-[#11141B]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base font-mono font-bold text-white tracking-wide">
                              {item.date}
                            </span>
                            {isSelected ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-black font-bold">
                                <Check className="w-3 h-3" strokeWidth={3} /> বাছাইকৃত
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#181D26] text-neutral-400 border border-[#282F3E]">
                                উন্মুক্ত
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="text-xs text-neutral-400 font-medium truncate">
                              {item.note || "অফিশিয়াল প্রমোশন ডে"}
                            </div>
                            <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                              {isSelected ? "এই তারিখে ক্যাম্পেইন শুরু হবে" : "ক্লিক করে নির্বাচন করুন"}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected Date Summary Strip */}
              {selectedDate && (
                <div className="p-3 rounded-[8px] bg-[#0C0E12] border border-[#232834] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[6px] bg-[#14231E] border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        নির্বাচিত প্রমোশন শুরুর তারিখ: <span className="font-mono text-emerald-400 font-bold">{selectedDate}</span>
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        আপনার {videoCount}টি ভিডিওর ক্যাম্পেইন এই তারিখ থেকে শুরু হবে ({activeTier.bioDays} দিন বায়োতে লিংকসহ)।
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right font-mono text-[10px] text-neutral-400">
                    ফুল ডে ক্যাম্পেইন
                  </div>
                </div>
              )}
            </div>

            {/* Step 3 Actions */}
            <div className="pt-3 border-t border-[#232834] flex items-center justify-between mt-auto">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-600 text-neutral-300 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="button"
                disabled={!selectedDate || availableDates.length === 0}
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 4: Payment Settlement & Order Confirmation Only */}
        {currentStep === 4 && (
          <section className="rounded-[16px] border border-[#232834] bg-[#14171E] p-4 sm:p-5 min-h-[520px] lg:h-[530px] flex flex-col justify-between">
            <div className="space-y-1 border-b border-[#232834] pb-3">
              <div className="text-xs font-mono tracking-wide font-semibold rgb-text">
                পেমেন্ট ও অর্ডার কনফার্মেশন
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white mt-0.5">
                পেমেন্ট সম্পন্ন করুন এবং ট্রানজেকশন আইডি দিন
              </h2>
              <p className="text-xs text-neutral-400">
                প্রমোশন নিশ্চিত করতে ১০০% ফুল অ্যাডভান্স পেমেন্ট প্রযোজ্য। পেমেন্ট সম্পন্ন করে TrxID লিখে সাবমিট করলেই সম্পূর্ণ ইনভয়েস পেয়ে যাবেন।
              </p>
            </div>

            {submitted ? (
              <div className="border border-emerald-900/60 bg-[#0C1713] rounded-[8px] p-6 text-center space-y-4 my-auto">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                    বুকিং সফলভাবে সম্পন্ন হয়েছে
                  </div>
                  <h3 className="text-lg font-semibold text-white">ইনভয়েস #{orderId} প্রস্তুত</h3>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    আপনার তথ্য ও পেমেন্ট রেফারেন্স গ্রহণ করা হয়েছে। দ্রুত আপনাকে আমাদের অফিশিয়াল প্রমোশন গ্রুপে যুক্ত করা হবে।
                  </p>
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" /> অফিশিয়াল হোয়াটসঅ্যাপ ডেস্ক খুলুন
                </a>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {submissionError && (
                  <div className="p-3 rounded-[6px] bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{submissionError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Complete Order Summary Ticket (5 Cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="border border-[#232834] rounded-[10px] bg-[#0C0E12] p-4 space-y-2.5">
                      <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 border-b border-[#232834] pb-2 flex items-center justify-between">
                        <span>অর্ডারের চূড়ান্ত সারসংক্ষেপ</span>
                        <span className="text-emerald-400 font-bold">{videoCount}টি ভিডিও</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-neutral-400">
                          <span>প্রচারের মাধ্যম:</span>
                          <span className="text-white font-medium">{selectedCategory.title}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>ক্লায়েন্ট / প্রতিষ্ঠান:</span>
                          <span className="text-white font-medium">{clientName || "প্রদান করা হয়েছে"}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>যোগাযোগ নম্বর:</span>
                          <span className="text-white font-medium font-mono">{phone || "প্রদান করা হয়েছে"}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>প্রমোশন শুরুর তারিখ:</span>
                          <span className="text-white font-medium font-mono">{selectedDate}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>বায়ো লিংক স্থায়িত্ব:</span>
                          <span className="text-emerald-400 font-medium">{activeTier.bioDays} দিন বায়োতে লিংক</span>
                        </div>
                        <div className="border-t border-[#232834] pt-2.5 flex justify-between text-sm font-mono font-bold text-white">
                          <span>মোট অগ্রিম প্রদেয়:</span>
                          <span className="text-emerald-400 font-bold text-base">৳ {activeTier.price} টাকা</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-[8px] bg-[#0C0E12] border border-[#232834] flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>১০০% ফুল অ্যাডভান্স পেমেন্ট সম্পন্ন করার পরই স্লট নিশ্চিত হবে।</span>
                    </div>
                  </div>

                  {/* Right: Payment Channels & TrxID Input (7 Cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Payment Channel Selector & Send Money Instructions */}
                    <div className="border border-[#232834] rounded-[10px] bg-[#0C0E12] p-4 sm:p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-400" />
                          পেমেন্ট মাধ্যম বেছে নিন
                        </div>
                        <div className="flex gap-1.5">
                          {["bKash Personal", "Nagad Personal", "Rocket Personal"].map((provider) => (
                            <button
                              key={provider}
                              type="button"
                              onClick={() => setPaymentProvider(provider)}
                              className={`text-[10px] font-mono px-2.5 py-1 rounded-[6px] border transition-all cursor-pointer ${
                                paymentProvider === provider
                                  ? "border-emerald-500 text-emerald-400 bg-[#14231E] font-bold"
                                  : "border-[#232834] text-neutral-400 bg-[#11141B] hover:border-neutral-700"
                              }`}
                            >
                              {provider.split(" ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Official Number Box */}
                      <div className="p-3.5 rounded-[8px] bg-[#14171E] border border-[#232834] flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-neutral-400 font-mono uppercase">
                            সেন্ড মানি নম্বর ({paymentProvider})
                          </div>
                          <div className="text-base font-mono font-bold text-white tracking-wider mt-0.5">
                            {getActivePaymentNumber()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-neutral-400 font-mono">প্রদেয় পরিমাণ</div>
                          <div className="text-sm font-mono font-bold text-emerald-400">৳ {activeTier.price} টাকা</div>
                        </div>
                      </div>

                      {/* TrxID Input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-neutral-300">
                          পেমেন্ট সম্পন্ন করার পর প্রাপ্ত TrxID (Transaction ID) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: BL9A7K80PX"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          className="w-full bg-[#14171E] border border-[#232834] rounded-[8px] px-3.5 py-2.5 text-xs font-mono uppercase text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                        <p className="text-[10px] text-neutral-500 font-mono">
                          * টাকা পাঠানোর পর মেসেজে আসা TrxID হুবহু এখানে লিখুন।
                        </p>
                      </div>
                    </div>

                    {/* Step 4 Actions */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-600 text-neutral-300 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={submitting || !trxId.trim()}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
                      >
                        {submitting ? "অর্ডার পাঠানো হচ্ছে..." : "অর্ডার কনফার্ম করুন ও ইনভয়েস পান"}
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </section>
        )}
      </main>

      {/* Footer (Compact Zero-Scroll Single-View Bar) */}
      <footer className="border-t border-[#232834] bg-[#14171E] py-2 sm:py-2.5 text-xs text-neutral-500 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">MEX TANIM ESPORTS</span>
            <span>—</span>
            <span className="hidden sm:inline">Official Promotional Platform</span>
          </div>

          {/* Official Social Line Icons */}
          <div className="flex items-center gap-1.5">
            {/* WhatsApp Channel */}
            <a
              href="https://whatsapp.com/channel/0029Vb6F0j54Y9lssQHIcv0s"
              target="_blank"
              rel="noreferrer"
              aria-label="Official WhatsApp Channel"
              className="w-7 h-7 rounded-[6px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                stroke="currentColor"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>

            {/* Telegram Channel */}
            <a
              href="https://t.me/mextanimesports"
              target="_blank"
              rel="noreferrer"
              aria-label="Official Telegram Channel"
              className="w-7 h-7 rounded-[6px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                stroke="currentColor"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </a>

            {/* YouTube Channel */}
            <a
              href="https://youtube.com/@mextanimesports?si=ws5SDD5GgPzZSoIV"
              target="_blank"
              rel="noreferrer"
              aria-label="Official YouTube Channel"
              className="w-7 h-7 rounded-[6px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                stroke="currentColor"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <polygon points="10 15 15 12 10 9 10 15" />
              </svg>
            </a>

            {/* Discord Server */}
            <a
              href="https://discord.gg/HCcsKvFh9d"
              target="_blank"
              rel="noreferrer"
              aria-label="Official Discord Server"
              className="w-7 h-7 rounded-[6px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                stroke="currentColor"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6h0a14.5 14.5 0 0 0-4-1.5c-.2.4-.4.9-.6 1.4a13.3 13.3 0 0 0-3.8 0c-.2-.5-.4-1-.6-1.4A14.5 14.5 0 0 0 5 6a16.6 16.6 0 0 0-3 12c2 1.5 4 2.5 6 2.5.5-.6.9-1.3 1.3-2-1-.4-1.5-.9-2-1.5.2.1.3.2.5.3 2.5 1.2 5 1.2 7.4 0 .2-.1.4-.2.5-.3-.5.6-1 1.1-2 1.5.4.7.8 1.4 1.3 2 2 0 4-1 6-2.5 0-4-.5-8.5-3-12z" />
                <circle cx="8.5" cy="12.5" r="1" />
                <circle cx="15.5" cy="12.5" r="1" />
              </svg>
            </a>
          </div>

          <div className="text-[10px] text-neutral-500">সকল প্রমোশন স্লট চূড়ান্ত অনুমোদনের ওপর নির্ভরশীল। © ২০২৬।</div>
        </div>
      </footer>

      {/* 24/7 AI Live Support Floating Widget */}
      <SupportChat />
    </div>
  );
}
