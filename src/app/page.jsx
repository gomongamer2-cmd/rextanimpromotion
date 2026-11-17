"use client";

import { useState, useEffect } from "react";
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
  ChevronUp
} from "lucide-react";
import SupportChat from "../components/SupportChat";

// 3 Official Target Categories
const CATEGORIES = [
  {
    id: "tournament-app",
    title: "টুর্নামেন্ট অ্যাপ প্রমোশন",
    icon: Smartphone,
    description: "অ্যাপ ডাউনলোড, সক্রিয় প্লেয়ার সাইন-আপ ও টুর্নামেন্ট ফিচার।",
  },
  {
    id: "whatsapp-channel",
    title: "হোয়াটসঅ্যাপ চ্যানেল প্রমোশন",
    icon: Radio,
    description: "ভেরিফাইড চ্যানেল ফলোয়ার বৃদ্ধি ও অফিশিয়াল সম্প্রচার।",
  },
  {
    id: "whatsapp-group",
    title: "হোয়াটসঅ্যাপ গ্রুপ প্রমোশন",
    icon: Users2,
    description: "কমিউনিটি প্লেয়ার অনবোর্ডিং, টুর্নামেন্ট স্লট বুকিং ও মেম্বার বৃদ্ধি।",
  },
];

// Exact 10-Tier Pricing & Perks Matrix from Business Specifications (Bengali)
const VIDEO_TIERS = {
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
  const [videoCount, setVideoCount] = useState(1);
  const [isTierListOpen, setIsTierListOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-11-20");

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

  const activeTier = VIDEO_TIERS[videoCount] || VIDEO_TIERS[1];
  const WHATSAPP_NUMBER = "8801700000000";

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
    <div className="min-h-screen bg-[#0C0E12] text-[#EDEDED]">
      {/* Top Navigation */}
      <header className="border-b border-[#232834] bg-[#14171E] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Mex Tanim Esports Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>MEX TANIM</span>
                <span className="text-neutral-300 font-medium">
                  Promotional Platform
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-400 font-medium tracking-normal mt-0.5">
                Official Tournament &amp; Media Promotion
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Minimal 1-2-3-4 Connected Stepper (Zero text, numbers & glowing connecting line) */}
        <div className="border border-[#232834] rounded-[16px] bg-[#14171E] p-4 sm:p-5">
          <div className="relative flex items-center justify-between max-w-md mx-auto px-4 sm:px-6">
            {/* Background connecting line */}
            <div className="absolute left-[36px] sm:left-[46px] right-[36px] sm:right-[46px] top-1/2 -translate-y-1/2 h-[2px] bg-[#232834] z-0">
              {/* Dynamic Active Progress Line */}
              <div
                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-300"
                style={{
                  width:
                    currentStep === 1
                      ? "0%"
                      : currentStep === 2
                      ? "33.33%"
                      : currentStep === 3
                      ? "66.66%"
                      : "100%",
                }}
              />
            </div>

            {[1, 2, 3, 4].map((stepNum) => {
              const isCurrent = currentStep === stepNum;
              const isCompleted = currentStep > stepNum;
              const isClickable = isCompleted || stepNum < currentStep;

              return (
                <button
                  key={stepNum}
                  type="button"
                  disabled={!isClickable && !isCurrent}
                  onClick={() => {
                    if (isClickable) setCurrentStep(stepNum);
                  }}
                  className={`relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full font-mono text-sm sm:text-base font-bold flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400 scale-110 cursor-default"
                      : isCompleted
                      ? "bg-[#14231E] border border-emerald-500/80 text-emerald-400 cursor-pointer hover:border-emerald-400"
                      : "bg-[#0C0E12] border border-[#232834] text-neutral-600 opacity-40 cursor-not-allowed"
                  }`}
                  aria-label={`ধাপ ${stepNum}`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
                  ) : (
                    stepNum
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 1: Scope & Volume (Master-Detail Interactive Tier Explorer) */}
        {currentStep === 1 && (
          <section className="rounded-[16px] border border-[#232834] bg-[#14171E] p-5 sm:p-7 min-h-[580px] flex flex-col justify-between">
            <div className="space-y-6">
              {/* Step Header */}
              <div className="space-y-1 border-b border-[#232834] pb-4">
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  পর্যায় ০১ — প্রমোশনের মাধ্যম ও ভিডিও প্যাকেজ
                </div>
                <h2 className="text-xl font-semibold text-white">
                  প্রমোশনের মাধ্যম এবং ভিডিও প্যাকেজ নির্বাচন করুন
                </h2>
                <p className="text-xs text-neutral-400">
                  আপনার প্রমোশনের মাধ্যম এবং প্যাকেজ বেছে নিন। প্রতিটি প্যাকেজের বিস্তারিত স্পেসিফিকেশন ও সুবিধা ডানে দেখতে পাবেন।
                </p>
              </div>

              {/* Target Medium Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">
                  ১. প্রমোশনের মাধ্যম বেছে নিন
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-left p-3.5 sm:p-4 rounded-[10px] border transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-emerald-500 bg-[#14231E] text-white"
                            : "border-[#232834] bg-[#0C0E12] text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon
                            className={`w-5 h-5 ${
                              isSelected ? "text-emerald-400" : "text-neutral-500"
                            }`}
                          />
                          {isSelected && (
                            <span className="text-[10px] font-mono uppercase text-emerald-400 flex items-center gap-1 font-semibold">
                              <Check className="w-3.5 h-3.5" /> বাছাইকৃত
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-white mb-0.5">{cat.title}</div>
                          <div className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                            {cat.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TWO COLUMN MASTER-DETAIL SECTION (Left: Accordion Tier Selector, Right: Live Specification Panel) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* LEFT COLUMN: Package Selector with Expandable Full List */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-neutral-400" />
                      ২. ভিডিও প্যাকেজ নির্বাচন করুন
                    </label>
                    <span className="text-[11px] font-mono text-neutral-500">
                      মোট ১০টি প্যাকেজ
                    </span>
                  </div>

                  {/* Master Card (Current Selected Tier - Click to Toggle) */}
                  <div className="rounded-[12px] border border-[#232834] bg-[#0C0E12] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsTierListOpen((prev) => !prev)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-[#14171E] transition-all cursor-pointer"
                      aria-expanded={isTierListOpen}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[8px] bg-[#14231E] border border-emerald-500/40 flex items-center justify-center flex-shrink-0 text-emerald-400 font-bold text-sm font-mono">
                          {videoCount < 10 ? `0${videoCount}` : videoCount}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white flex items-center gap-2">
                            <span>{videoCount}টি ভিডিওর প্যাকেজ</span>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-bold">
                              সক্রিয়
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                            {activeTier.bioDays} দিন বায়ো লিংক • 1080p HD
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right font-mono">
                          <div className="text-sm font-bold text-white">৳{activeTier.price}</div>
                          <div className="text-[10px] text-neutral-400">ক্লিক করে তালিকা দেখুন</div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-[#181D26] border border-[#2B3242] flex items-center justify-center text-neutral-400 flex-shrink-0">
                          {isTierListOpen ? (
                            <ChevronUp className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expandable 1-10 Video Tier Full List */}
                    {isTierListOpen && (
                      <div className="p-2 space-y-1.5 max-h-[360px] overflow-y-auto divide-y divide-[#1D222E]/40 border-t border-[#232834] animate-in fade-in slide-in-from-top-2 duration-200">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                          const tier = VIDEO_TIERS[num];
                          const isCurrent = videoCount === num;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => {
                                setVideoCount(num);
                              }}
                              className={`w-full p-2.5 rounded-[8px] flex items-center justify-between text-left transition-all ${
                                isCurrent
                                  ? "bg-[#14231E] border border-emerald-500/60 text-white"
                                  : "hover:bg-[#14171E] border border-transparent text-neutral-300"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-7 h-7 rounded-[6px] flex items-center justify-center text-xs font-mono font-bold ${
                                    isCurrent
                                      ? "bg-emerald-500 text-black"
                                      : "bg-[#161A22] border border-[#262C3A] text-neutral-400"
                                  }`}
                                >
                                  {isCurrent ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : num}
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                                    <span>{num}টি ভিডিও প্যাকেজ</span>
                                    {num === 10 && (
                                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-red-950/70 border border-red-800 text-red-300">
                                        সর্বাধিক সাশ্রয়ী
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-neutral-400 font-mono">
                                    {tier.bioDays} দিন বায়ো লিংক অন্তর্ভুক্ত
                                  </div>
                                </div>
                              </div>

                              <div className="text-right font-mono text-xs font-bold text-white">
                                ৳{tier.price}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: Live Specification & Perfect Details Panel */}
                <div className="lg:col-span-7 rounded-[12px] border border-[#232834] bg-[#0C0E12] p-4 sm:p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#232834] pb-3">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-emerald-400" />
                          প্যাকেজ স্পেসিফিকেশন ও সুবিধা
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                          {videoCount}টি ভিডিও প্রমোশন প্যাকেজ
                        </h3>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-xs text-neutral-400">মোট মূল্য</div>
                        <div className="text-lg font-black text-white">৳ {activeTier.price}</div>
                      </div>
                    </div>

                    {/* Key Specifications Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-2.5 rounded-[8px] bg-[#14171E] border border-[#232834] flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] text-neutral-400 font-mono">বায়ো লিংক পিন</div>
                          <div className="text-xs font-semibold text-white">
                            {activeTier.bioDays} দিন মেক্স তানিম বায়োতে
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-[8px] bg-[#14171E] border border-[#232834] flex items-center gap-2.5">
                        <Video className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] text-neutral-400 font-mono">ভিডিও সংখ্যা</div>
                          <div className="text-xs font-semibold text-white">
                            {activeTier.videos}টি ফুল HD ভিডিও
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-[8px] bg-[#14171E] border border-[#232834] flex items-center gap-2.5">
                        <Layers className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] text-neutral-400 font-mono">প্রচার মাধ্যম</div>
                          <div className="text-xs font-semibold text-white truncate max-w-[150px]">
                            {selectedCategory.title}
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-[8px] bg-[#14171E] border border-[#232834] flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] text-neutral-400 font-mono">পোস্ট স্থায়িত্ব</div>
                          <div className="text-xs font-semibold text-white">
                            পার্মানেন্ট আর্কাইভ
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* All Included Official Perks for this specific Tier */}
                    <div className="space-y-2">
                      <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                        প্যাকেজে অন্তর্ভুক্ত সুবিধাসমূহ ({activeTier.perks.length}টি ফিচার):
                      </div>
                      <div className="space-y-1.5 bg-[#14171E] rounded-[8px] p-3 border border-[#232834]">
                        {activeTier.perks.map((perk, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Summary & Guarantee line */}
                  <div className="pt-2 border-t border-[#232834] flex items-center justify-between text-xs text-neutral-400">
                    <span className="flex items-center gap-1.5 font-mono text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      ১০০% ফুল অ্যাডভান্স পেমেন্ট প্রযোজ্য
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold text-xs">
                      স্লট বুকিং প্রস্তুত
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="pt-4 border-t border-[#232834] flex items-center justify-between mt-auto">
              <div className="text-xs font-mono text-neutral-400">
                নির্বাচিত: {videoCount}টি ভিডিও ({selectedCategory.title}) — ৳{activeTier.price}
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer"
              >
                পরবর্তী ধাপ (ক্লায়েন্ট তথ্য)
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 2: Client & Tournament Intake Information */}
        {currentStep === 2 && (
          <section className="rounded-[16px] border border-[#232834] bg-[#14171E] p-6 sm:p-8 min-h-[580px] flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b border-[#232834] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    পর্যায় ০২ — ক্লায়েন্টের তথ্য ও টুর্নামেন্ট বিবরণ
                  </div>
                  <h2 className="text-xl font-semibold text-white mt-1">
                    আপনার প্রতিষ্ঠান ও টুর্নামেন্টের প্রয়োজনীয় তথ্য দিন
                  </h2>
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  নির্বাচিত: <span className="text-white font-bold">{videoCount}টি ভিডিও</span> ({selectedCategory.title}) — ৳{activeTier.price}
                </div>
              </div>

              {/* Form Fields Card */}
              <div className="border border-[#232834] rounded-[12px] bg-[#0C0E12] p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1.5">
                      অরগানাইজেশন বা ক্লায়েন্টের নাম *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: BD Esports Org"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-[#14171E] border border-[#232834] rounded-[8px] px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1.5">
                      অ্যাক্টিভ হোয়াটসঅ্যাপ নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="যেমন: +880 1700 000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#14171E] border border-[#232834] rounded-[8px] px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1.5">
                    কোন কোন টুর্নামেন্ট চালাবেন (গেম, টুর্নামেন্ট নাম ও ফরম্যাট) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="যেমন: Free Fire Squad Cup / PUBG Mobile Daily Scrims (প্রাইজপুল ও এন্ট্রি ফি উল্লেখ করতে পারেন)"
                    value={tournamentDetails}
                    onChange={(e) => setTournamentDetails(e.target.value)}
                    className="w-full bg-[#14171E] border border-[#232834] rounded-[8px] px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1.5">
                      অরগানাইজেশন লোগো বা ড্রাইভ লিংক (ঐচ্ছিক)
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={orgLogoLink}
                      onChange={(e) => setOrgLogoLink(e.target.value)}
                      className="w-full bg-[#14171E] border border-[#232834] rounded-[8px] px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1.5">
                      NID / জন্মনিবন্ধন ও ছবির ড্রাইভ লিংক (ঐচ্ছিক)
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={kycVerificationLink}
                      onChange={(e) => setKycVerificationLink(e.target.value)}
                      className="w-full bg-[#14171E] border border-[#232834] rounded-[8px] px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
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
            <div className="pt-4 border-t border-[#232834] flex items-center justify-between mt-auto">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-600 text-neutral-300 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                পূর্ববর্তী ধাপ
              </button>

              <button
                type="button"
                disabled={!clientName.trim() || !phone.trim() || !tournamentDetails.trim()}
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                পরবর্তী ধাপ (তারিখ নির্বাচন)
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: Admin-Published Promotion Date Selection (No Hourly Slots) */}
        {currentStep === 3 && (
          <section className="rounded-[16px] border border-[#232834] bg-[#14171E] p-6 sm:p-8 min-h-[580px] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-1 border-b border-[#232834] pb-4">
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  পর্যায় ০৩ — প্রমোশন শুরুর তারিখ নির্বাচন
                </div>
                <h2 className="text-xl font-semibold text-white">
                  প্রমোশন প্রচারণার শুরুর তারিখ বেছে নিন
                </h2>
                <p className="text-xs text-neutral-400">
                  অ্যাডমিন কর্তৃক নির্ধারিত সক্রিয় তারিখগুলো থেকে আপনার প্রমোশন শুরুর দিনটি নির্বাচন করুন। নির্বাচিত তারিখ থেকেই মেক্স তানিম অফিশিয়াল প্রচারণা শুরু হবে।
                </p>
              </div>

              {/* Date Selection Grid */}
              <div className="space-y-3">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {availableDates.map((item) => {
                      const isSelected = selectedDate === item.date;
                      return (
                        <button
                          key={item.date}
                          type="button"
                          onClick={() => setSelectedDate(item.date)}
                          className={`p-4 rounded-[12px] border text-left transition-all flex flex-col justify-between h-[120px] cursor-pointer ${
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
                            <div className="text-[10px] text-neutral-500 font-mono mt-1">
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
                <div className="p-3.5 rounded-[10px] bg-[#0C0E12] border border-[#232834] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[8px] bg-[#14231E] border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        নির্বাচিত প্রমোশন শুরুর তারিখ: <span className="font-mono text-emerald-400 font-bold">{selectedDate}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        আপনার {videoCount}টি ভিডিওর ক্যাম্পেইন এই তারিখ থেকে শুরু হবে ({activeTier.bioDays} দিন বায়োতে লিংকসহ)।
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right font-mono text-[11px] text-neutral-400">
                    ফুল ডে ক্যাম্পেইন
                  </div>
                </div>
              )}
            </div>

            {/* Step 3 Actions */}
            <div className="pt-4 border-t border-[#232834] flex items-center justify-between mt-auto">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-600 text-neutral-300 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                পূর্ববর্তী ধাপ
              </button>

              <button
                type="button"
                disabled={!selectedDate || availableDates.length === 0}
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                পরবর্তী ধাপ (পেমেন্ট ও অর্ডার)
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 4: Payment Settlement & Order Confirmation Only */}
        {currentStep === 4 && (
          <section className="rounded-[16px] border border-[#232834] bg-[#14171E] p-6 sm:p-8 min-h-[580px] flex flex-col justify-between">
            <div className="space-y-1 border-b border-[#232834] pb-4">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                পর্যায় ০৪ — পেমেন্ট ও অর্ডার কনফার্মেশন
              </div>
              <h2 className="text-xl font-semibold text-white">
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
                            01611657757
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
                        পূর্ববর্তী ধাপ
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

      {/* Footer */}
      <footer className="border-t border-[#232834] bg-[#14171E] py-8 text-xs text-neutral-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">MEX TANIM ESPORTS</span>
            <span>—</span>
            <span>Official Tournament App, WhatsApp Channel &amp; Group Promotional Platform</span>
          </div>

          {/* Official Social Line Icons (No text, no emojis) */}
          <div className="flex items-center gap-2">
            {/* WhatsApp Channel */}
            <a
              href="https://whatsapp.com/channel/0029Vb6F0j54Y9lssQHIcv0s"
              target="_blank"
              rel="noreferrer"
              aria-label="Official WhatsApp Channel"
              className="w-9 h-9 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
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
              className="w-9 h-9 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
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
              className="w-9 h-9 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
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
              className="w-9 h-9 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
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

          <div>সকল প্রমোশন স্লট চূড়ান্ত অনুমোদনের ওপর নির্ভরশীল। © ২০২৬।</div>
        </div>
      </footer>

      {/* 24/7 AI Live Support Floating Widget */}
      <SupportChat />
    </div>
  );
}
