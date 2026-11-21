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
  Megaphone,
  Printer,
  Download,
  Copy,
  UploadCloud,
  Lock,
  FolderOpen,
  Trash2,
  RefreshCw,
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

  // Logo & Banner Google Drive Upload States
  const [orgLogoUrl, setOrgLogoUrl] = useState("");
  const [orgLogoId, setOrgLogoId] = useState("");
  const [orgLogoPreview, setOrgLogoPreview] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [orgBannerUrl, setOrgBannerUrl] = useState("");
  const [orgBannerId, setOrgBannerId] = useState("");
  const [orgBannerPreview, setOrgBannerPreview] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [driveFolderUrl, setDriveFolderUrl] = useState("");
  const [driveFolderId, setDriveFolderId] = useState("");
  const [nameMissingWarning, setNameMissingWarning] = useState("");
  const nameInputRef = React.useRef(null);
  const phoneInputRef = React.useRef(null);
  const detailsInputRef = React.useRef(null);
  const logoInputRef = React.useRef(null);
  const bannerInputRef = React.useRef(null);

  // Sleek Non-Intrusive Notification Toast with Smooth Fade In & Fade Out for Step 2
  const [step2Toast, setStep2Toast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastFadeTimeoutRef = React.useRef(null);
  const toastRemoveTimeoutRef = React.useRef(null);

  const showStep2Toast = (msg, fieldToFocus = null) => {
    if (toastFadeTimeoutRef.current) clearTimeout(toastFadeTimeoutRef.current);
    if (toastRemoveTimeoutRef.current) clearTimeout(toastRemoveTimeoutRef.current);

    setStep2Toast(msg);
    // Trigger entrance animation immediately
    requestAnimationFrame(() => {
      setToastVisible(true);
    });

    if (fieldToFocus === "name") {
      nameInputRef.current?.focus();
    } else if (fieldToFocus === "phone") {
      phoneInputRef.current?.focus();
    } else if (fieldToFocus === "details") {
      detailsInputRef.current?.focus();
    }

    // Smoothly fade out after 2600ms
    toastFadeTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
      // Unmount from DOM after fade-out transition completes (600ms)
      toastRemoveTimeoutRef.current = setTimeout(() => {
        setStep2Toast("");
      }, 600);
    }, 2600);
  };

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [copiedSlip, setCopiedSlip] = useState(false);
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

  const handlePrintSlip = () => {
    window.print();
  };

  const handleDownloadSlipText = () => {
    if (!submittedBooking) return;
    const slipText = `=====================================================
          MEX TANIM ESPORTS — OFFICIAL ORDER SLIP
=====================================================
Order / Invoice ID : #${submittedBooking.orderId}
Booking Date & Time: ${submittedBooking.createdAt}
Status             : PENDING VERIFICATION

CLIENT DETAILS:
-----------------------------------------------------
Client / Org Name  : ${submittedBooking.clientName}
Contact Phone / WA : ${submittedBooking.phone}
Target Medium      : ${submittedBooking.category}
Video Package      : ${submittedBooking.videoCount} Video(s)
Bio Link Duration  : ${submittedBooking.bioLinkDays} Days in Bio
Promotion Date     : ${submittedBooking.selectedDate}
Tournament Details : ${submittedBooking.tournamentDetails}

PAYMENT DETAILS:
-----------------------------------------------------
Total Fee          : BDT ${submittedBooking.totalPrice} (Full Advance)
Payment Provider   : ${submittedBooking.paymentMethod}
Transaction ID     : ${submittedBooking.trxId}

VERIFICATION & AUTHENTICITY:
-----------------------------------------------------
Verified via Mex Tanim Automated Engine
Official WhatsApp  : ${WHATSAPP_NUMBER}
=====================================================
Keep this slip safely. Send this Order ID to Mex Tanim 
Admin anytime to track your promotion status.
=====================================================`;

    const blob = new Blob([slipText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Mex_Tanim_Order_Slip_${submittedBooking.orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySlip = () => {
    if (!submittedBooking) return;
    const slipText = `*MEX TANIM ESPORTS — OFFICIAL ORDER SLIP*
Invoice ID: #${submittedBooking.orderId}
Client: ${submittedBooking.clientName} (${submittedBooking.phone})
Medium: ${submittedBooking.category}
Package: ${submittedBooking.videoCount} Video(s) [${submittedBooking.bioLinkDays} Days Bio Link]
Total: BDT ${submittedBooking.totalPrice}
Promotion Date: ${submittedBooking.selectedDate}
TrxID: ${submittedBooking.trxId} (${submittedBooking.paymentMethod})
Status: Pending Verification`;

    navigator.clipboard.writeText(slipText);
    setCopiedSlip(true);
    setTimeout(() => setCopiedSlip(false), 2500);
  };

  // Handle Logo Upload to Google Drive (Under Client's own sub-folder)
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!clientName.trim()) {
      showStep2Toast("ফাইল আপলোড করার আগে অরগানাইজেশন বা ক্লায়েন্টের নাম লিখুন", "name");
      if (e.target) e.target.value = "";
      return;
    }

    setUploadingLogo(true);
    setNameMissingWarning("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("clientName", clientName.trim());
      formData.append("type", "logo");
      if (orgLogoId) formData.append("oldFileId", orgLogoId);
      if (driveFolderId) formData.append("folderId", driveFolderId);
      if (driveFolderUrl) formData.append("folderUrl", driveFolderUrl);

      const res = await fetch("/api/upload/drive", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setOrgLogoUrl(data.fileUrl);
        setOrgLogoId(data.fileId);
        setOrgLogoPreview(data.thumbnailUrl || data.fileUrl);
        if (data.folderId) setDriveFolderId(data.folderId);
        if (data.folderUrl) setDriveFolderUrl(data.folderUrl);
      } else {
        alert(data.error || "লোগো আপলোড করা সম্ভব হয়নি।");
      }
    } catch (err) {
      console.error("Logo upload error:", err);
      alert("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setUploadingLogo(false);
      if (e.target) e.target.value = "";
    }
  };

  // Handle Logo Removal (Deletes old file from Google Drive)
  const handleRemoveLogo = async () => {
    const fileIdToDelete = orgLogoId;
    setOrgLogoUrl("");
    setOrgLogoId("");
    setOrgLogoPreview("");

    if (fileIdToDelete) {
      try {
        await fetch(`/api/upload/drive?fileId=${encodeURIComponent(fileIdToDelete)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("Could not delete logo from Google Drive:", err);
      }
    }
  };

  // Handle Banner Upload to Google Drive (Under Client's own sub-folder)
  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!clientName.trim()) {
      showStep2Toast("ফাইল আপলোড করার আগে অরগানাইজেশন বা ক্লায়েন্টের নাম লিখুন", "name");
      if (e.target) e.target.value = "";
      return;
    }

    setUploadingBanner(true);
    setNameMissingWarning("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("clientName", clientName.trim());
      formData.append("type", "banner");
      if (orgBannerId) formData.append("oldFileId", orgBannerId);
      if (driveFolderId) formData.append("folderId", driveFolderId);
      if (driveFolderUrl) formData.append("folderUrl", driveFolderUrl);

      const res = await fetch("/api/upload/drive", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setOrgBannerUrl(data.fileUrl);
        setOrgBannerId(data.fileId);
        setOrgBannerPreview(data.thumbnailUrl || data.fileUrl);
        if (data.folderId) setDriveFolderId(data.folderId);
        if (data.folderUrl) setDriveFolderUrl(data.folderUrl);
      } else {
        alert(data.error || "ব্যানার আপলোড করা সম্ভব হয়নি।");
      }
    } catch (err) {
      console.error("Banner upload error:", err);
      alert("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setUploadingBanner(false);
      if (e.target) e.target.value = "";
    }
  };

  // Handle Banner Removal (Deletes old file from Google Drive)
  const handleRemoveBanner = async () => {
    const fileIdToDelete = orgBannerId;
    setOrgBannerUrl("");
    setOrgBannerId("");
    setOrgBannerPreview("");

    if (fileIdToDelete) {
      try {
        await fetch(`/api/upload/drive?fileId=${encodeURIComponent(fileIdToDelete)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("Could not delete banner from Google Drive:", err);
      }
    }
  };

  // Step 2 Form Validation & Smooth Flow Transition
  const handleNextStep2 = () => {
    if (uploadingLogo || uploadingBanner) {
      showStep2Toast("ফাইল আপলোড চলমান রয়েছে, অনুগ্রহ করে অপেক্ষা করুন");
      return;
    }
    if (!clientName.trim()) {
      showStep2Toast("অনুগ্রহ করে অরগানাইজেশন বা ক্লায়েন্টের নাম লিখুন", "name");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 13) {
      showStep2Toast("অনুগ্রহ করে সঠিক ১০ ডিজিটের Active WhatsApp Number দিন", "phone");
      return;
    }
    if (!tournamentDetails.trim()) {
      showStep2Toast("অনুগ্রহ করে Details Box এ টুর্নামেন্টের প্রয়োজনীয় তথ্য দিন", "details");
      return;
    }
    setCurrentStep(3);
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
          const firstAvailable = json.dates.find((d) => !d.isBooked);
          if (firstAvailable) {
            setSelectedDate(firstAvailable.date);
          } else {
            setSelectedDate("");
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

  // Active Promotion Lifecycle: Check if user has an active booking on this device
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mex_active_order");
      if (saved) {
        const orderData = JSON.parse(saved);
        if (orderData && orderData.orderId) {
          fetch(`/api/bookings/status?orderId=${encodeURIComponent(orderData.orderId)}`)
            .then((res) => res.json())
            .then((json) => {
              if (json.success && json.exists) {
                if (json.isCompleted) {
                  // Promotion is completed! Clear storage and make site fresh for new bookings
                  localStorage.removeItem("mex_active_order");
                  setSubmitted(false);
                  setSubmittedBooking(null);
                  setCurrentStep(1);
                } else {
                  // Promotion is still active (pending / confirmed)
                  setOrderId(orderData.orderId);
                  setSubmittedBooking({
                    ...orderData,
                    status: json.status || orderData.status,
                  });
                  setSubmitted(true);
                  setCurrentStep(4);
                }
              } else {
                localStorage.removeItem("mex_active_order");
                setSubmitted(false);
                setSubmittedBooking(null);
                setCurrentStep(1);
              }
            })
            .catch(() => {
              setOrderId(orderData.orderId);
              setSubmittedBooking(orderData);
              setSubmitted(true);
              setCurrentStep(4);
            });
        }
      }
    } catch (e) {
      console.error("Failed to restore active order:", e);
    }
  }, []);

  // Live Sync: Automatically free the site when admin marks promotion completed
  useEffect(() => {
    if (!submittedBooking?.orderId) return;

    const syncStatus = async () => {
      try {
        const res = await fetch(`/api/bookings/status?orderId=${encodeURIComponent(submittedBooking.orderId)}`);
        const json = await res.json();
        if (json.success && json.exists) {
          if (json.isCompleted) {
            localStorage.removeItem("mex_active_order");
            setSubmitted(false);
            setSubmittedBooking(null);
            setCurrentStep(1);
          } else if (json.status && json.status !== submittedBooking.status) {
            setSubmittedBooking((prev) => (prev ? { ...prev, status: json.status } : null));
          }
        }
      } catch (e) {}
    };

    const interval = setInterval(syncStatus, 15000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") syncStatus();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [submittedBooking?.orderId, submittedBooking?.status]);

  const handleResetForNewBooking = () => {
    setSubmitted(false);
    setSubmittedBooking(null);
    setClientName("");
    setPhone("");
    setTournamentDetails("");
    setTrxId("");
    setOrgLogoLink("");
    setOrgLogoUrl("");
    setOrgLogoId("");
    setOrgLogoPreview("");
    setOrgBannerUrl("");
    setOrgBannerId("");
    setOrgBannerPreview("");
    setDriveFolderUrl("");
    setDriveFolderId("");
    setNameMissingWarning("");
    setKycVerificationLink("");
    setVideoCount(0);
    setCurrentStep(1);
    try {
      localStorage.removeItem("mex_active_order");
    } catch (e) {}
  };

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
          if (
            clientName.trim() &&
            phone.trim() &&
            phone.replace(/\D/g, "").length >= 13 &&
            tournamentDetails.trim() &&
            !uploadingLogo &&
            !uploadingBanner
          ) {
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
          orgLogoUrl,
          orgLogoId,
          orgBannerUrl,
          orgBannerId,
          driveFolderUrl,
          driveFolderId,
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
      const newSlip = {
        orderId: confirmedOrderId,
        clientName,
        phone,
        category: selectedCategory.title,
        videoCount,
        totalPrice: activeTier.price,
        bioLinkDays: activeTier.bioDays,
        selectedDate,
        orgLogoUrl,
        orgBannerUrl,
        driveFolderUrl,
        tournamentDetails: tournamentDetails || "Not specified",
        paymentMethod: paymentProvider,
        trxId,
        createdAt: new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" }),
        status: "pending",
      };
      setOrderId(confirmedOrderId);
      setSubmittedBooking(newSlip);
      try {
        localStorage.setItem("mex_active_order", JSON.stringify(newSlip));
      } catch (e) {}
      setSubmitted(true);
    } catch (err) {
      console.error("Booking error:", err);
      setSubmissionError("Network error transmitting booking. Please check connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between bg-[#0C0E12] print:bg-white print:min-h-0 print:h-auto text-[#EDEDED] print:text-slate-900 ${
        submitted ? "lg:min-h-screen lg:overflow-y-auto" : "lg:h-screen lg:max-h-screen lg:overflow-hidden"
      }`}
    >
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
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-2 flex flex-col justify-center gap-2 sm:gap-3 print:bg-white print:p-0 print:m-0 print:max-w-none print:w-full print:block">
        {/* Sleek Balanced 1-2-3-4 Stepper (Proportional width, thin segmented lines between nodes, clean numbers) */}
        <div className="w-full max-w-2xl sm:max-w-3xl mx-auto px-4 sm:px-6 no-print">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNum, idx) => {
              const isCurrent = currentStep === stepNum;
              const isCompleted = currentStep > stepNum || (stepNum === 4 && submitted);
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
                className={`inline-flex items-center justify-center gap-2 h-10 min-w-[100px] px-5 rounded-[8px] text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-md ${
                  videoCount === 0
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50"
                    : "bg-white hover:bg-neutral-200 text-[#0C0E12] cursor-pointer"
                }`}
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 2: Client & Tournament Intake Information */}
        {currentStep === 2 && (
          <section className="relative rounded-[16px] border border-[#232834] bg-[#14171E] p-4 sm:p-5 min-h-[520px] lg:min-h-[530px] lg:h-auto flex flex-col justify-between">
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
                    <label className="h-5 flex items-center text-xs font-mono text-neutral-300 mb-1.5">
                      অরগানাইজেশন বা ক্লায়েন্টের নাম *
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      required
                      placeholder="যেমন: BD Esports Org"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        if (nameMissingWarning) setNameMissingWarning("");
                      }}
                      className="w-full h-10 bg-[#14171E] border border-[#232834] focus:border-emerald-500 rounded-[8px] px-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="h-5 flex items-center text-xs font-mono text-neutral-300 mb-1.5">
                      Active WhatsApp Number *
                    </label>
                    <div className="relative flex items-center h-10 rounded-[8px] bg-[#14171E] border border-[#232834] focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/40 transition-all">
                      <div className="flex items-center gap-1.5 pl-3 pointer-events-none select-none shrink-0">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-400 shrink-0">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.4 1.01 2.57.13.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z"/>
                        </svg>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          +880
                        </span>
                      </div>
                      <input
                        ref={phoneInputRef}
                        type="tel"
                        required
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="1XXXXXXXXX"
                        value={phone ? phone.replace("+880", "").trim() : ""}
                        onChange={(e) => {
                          let raw = e.target.value.replace(/\D/g, "");
                          if (raw.startsWith("880")) raw = raw.slice(3);
                          if (raw.startsWith("0")) raw = raw.slice(1);
                          const digits = raw.slice(0, 10);
                          setPhone(digits ? `+880 ${digits}` : "");
                        }}
                        className="w-full h-full bg-transparent px-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none font-mono tracking-wider"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    Details Box *
                  </label>
                  <textarea
                    ref={detailsInputRef}
                    rows={2}
                    required
                    placeholder="যেমন: Free Fire Squad Cup / PUBG Mobile Daily Scrims (প্রাইজপুল ও এন্ট্রি ফি উল্লেখ করতে পারেন)"
                    value={tournamentDetails}
                    onChange={(e) => setTournamentDetails(e.target.value)}
                    className="w-full bg-[#14171E] border border-[#232834] rounded-[8px] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>

                {/* UPLOAD SYSTEM: Profile Logo & Tournament Banner */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-neutral-200 flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-emerald-400" />
                      অরগানাইজেশন প্রোফাইল ও ব্যানার
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {clientName.trim()
                        ? `${clientName.trim()} এর ফাইল`
                        : "লোগো ও ব্যানার যুক্ত করুন"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* 1. Profile / Logo Upload Box */}
                    <div>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />

                      {!clientName.trim() ? (
                        /* Locked State: Requires Name First */
                        <div
                          onClick={() => {
                            showStep2Toast("ফাইল আপলোড করার আগে অরগানাইজেশন বা ক্লায়েন্টের নাম লিখুন", "name");
                          }}
                          className="border border-[#232834] border-dashed rounded-[10px] bg-[#0E1117] p-3.5 flex items-center gap-3 cursor-pointer opacity-60 hover:opacity-80 hover:border-amber-500/40 transition-all select-none"
                          title="আগে উপরে অরগানাইজেশন বা ক্লায়েন্টের নাম লিখুন"
                        >
                          <div className="w-10 h-10 rounded-[8px] bg-[#14171E] border border-[#232834] flex items-center justify-center text-neutral-500 flex-shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-mono font-semibold text-neutral-400">
                              অরগানাইজেশন লোগো
                            </div>
                            <div className="text-[10px] text-amber-400/90 font-mono">
                              আগে উপরে নাম লিখুন
                            </div>
                          </div>
                        </div>
                      ) : uploadingLogo ? (
                        /* Uploading State: Professional Sleek Spinner */
                        <div className="border border-emerald-500/40 rounded-[10px] bg-emerald-950/20 p-3.5 flex items-center justify-center gap-2.5 transition-all">
                          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                          <span className="text-xs font-mono font-bold tracking-wider text-emerald-400">
                            Uploading...
                          </span>
                        </div>
                      ) : orgLogoPreview ? (
                        /* Uploaded State: Image Preview with Change & Remove */
                        <div className="border border-emerald-500/40 rounded-[10px] bg-[#0E1513] p-3 flex items-center justify-between gap-2.5 shadow-sm">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={orgLogoPreview}
                              alt="Logo"
                              className="w-10 h-10 rounded-[6px] object-cover border border-emerald-500/40 flex-shrink-0"
                            />
                            <div className="truncate">
                              <div className="text-xs font-mono font-semibold text-white truncate flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                লোগো আপলোড সম্পন্ন
                              </div>
                              <div className="text-[10px] text-emerald-400/80 font-mono truncate">
                                {clientName.trim()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0 font-mono text-[11px]">
                            <button
                              type="button"
                              onClick={() => logoInputRef.current?.click()}
                              className="px-2 py-1 rounded bg-[#181E29] hover:bg-[#202737] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            >
                              পরিবর্তন
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="p-1 rounded bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Ready to Upload Dropzone */
                        <div
                          onClick={() => logoInputRef.current?.click()}
                          className="border border-[#2B3545] border-dashed hover:border-emerald-500/60 rounded-[10px] bg-[#10141D] hover:bg-[#141A25] p-3 flex items-center gap-3 cursor-pointer transition-all group"
                        >
                          <div className="w-10 h-10 rounded-[8px] bg-[#181E2A] group-hover:bg-[#1E2636] border border-[#232B3A] flex items-center justify-center text-emerald-400 transition-colors flex-shrink-0">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-mono font-semibold text-white group-hover:text-emerald-300 transition-colors">
                              অরগানাইজেশন লোগো আপলোড
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              PNG, JPG বা WEBP (সর্বোচ্চ ১০MB)
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Tournament / Org Banner Upload Box */}
                    <div>
                      <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleBannerUpload}
                        className="hidden"
                      />

                      {!clientName.trim() ? (
                        /* Locked State */
                        <div
                          onClick={() => {
                            showStep2Toast("ফাইল আপলোড করার আগে অরগানাইজেশন বা ক্লায়েন্টের নাম লিখুন", "name");
                          }}
                          className="border border-[#232834] border-dashed rounded-[10px] bg-[#0E1117] p-3.5 flex items-center gap-3 cursor-pointer opacity-60 hover:opacity-80 hover:border-amber-500/40 transition-all select-none"
                          title="আগে উপরে অরগানাইজেশন বা ক্লায়েন্টের নাম লিখুন"
                        >
                          <div className="w-10 h-10 rounded-[8px] bg-[#14171E] border border-[#232834] flex items-center justify-center text-neutral-500 flex-shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-mono font-semibold text-neutral-400">
                              টুর্নামেন্ট ব্যানার
                            </div>
                            <div className="text-[10px] text-amber-400/90 font-mono">
                              আগে উপরে নাম লিখুন
                            </div>
                          </div>
                        </div>
                      ) : uploadingBanner ? (
                        /* Uploading State: Sleek Spinner */
                        <div className="border border-emerald-500/40 rounded-[10px] bg-emerald-950/20 p-3.5 flex items-center justify-center gap-2.5 transition-all">
                          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                          <span className="text-xs font-mono font-bold tracking-wider text-emerald-400">
                            Uploading...
                          </span>
                        </div>
                      ) : orgBannerPreview ? (
                        /* Uploaded State: Banner Preview with Change & Remove */
                        <div className="border border-emerald-500/40 rounded-[10px] bg-[#0E1513] p-3 flex items-center justify-between gap-2.5 shadow-sm">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={orgBannerPreview}
                              alt="Banner"
                              className="w-14 h-9 rounded-[4px] object-cover border border-emerald-500/40 flex-shrink-0"
                            />
                            <div className="truncate">
                              <div className="text-xs font-mono font-semibold text-white truncate flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ব্যানার আপলোড সম্পন্ন
                              </div>
                              <div className="text-[10px] text-emerald-400/80 font-mono truncate">
                                {clientName.trim()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0 font-mono text-[11px]">
                            <button
                              type="button"
                              onClick={() => bannerInputRef.current?.click()}
                              className="px-2 py-1 rounded bg-[#181E29] hover:bg-[#202737] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            >
                              পরিবর্তন
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveBanner}
                              className="p-1 rounded bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Ready to Upload Dropzone */
                        <div
                          onClick={() => bannerInputRef.current?.click()}
                          className="border border-[#2B3545] border-dashed hover:border-emerald-500/60 rounded-[10px] bg-[#10141D] hover:bg-[#141A25] p-3 flex items-center gap-3 cursor-pointer transition-all group"
                        >
                          <div className="w-10 h-10 rounded-[8px] bg-[#181E2A] group-hover:bg-[#1E2636] border border-[#232B3A] flex items-center justify-center text-emerald-400 transition-colors flex-shrink-0">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-mono font-semibold text-white group-hover:text-emerald-300 transition-colors">
                              টুর্নামেন্ট ব্যানার আপলোড
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              ওয়াইড ব্যানার (সর্বোচ্চ ১০MB)
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Security Notice */}
                <div className="pt-2 border-t border-[#232834] flex items-center text-[11px] text-neutral-400 font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    All uploaded assets are encrypted & securely processed
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Borderless Notification Toast (Smooth Fade In & Fade Out) */}
            {step2Toast && (
              <div
                className={`absolute bottom-16 sm:bottom-18 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-500 ease-out ${
                  toastVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-2 scale-95"
                }`}
              >
                <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#161B26]/95 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.95)] text-xs font-mono select-none border-none">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                  <span className="text-neutral-100 font-medium tracking-wide whitespace-nowrap">
                    {step2Toast}
                  </span>
                </div>
              </div>
            )}

            {/* Step 2 Actions */}
            <div className="pt-3 border-t border-[#232834] flex items-center justify-between mt-auto">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center justify-center gap-2 h-10 min-w-[100px] px-5 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-600 text-neutral-300 text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep2}
                className="inline-flex items-center justify-center gap-2 h-10 min-w-[100px] px-5 rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer"
              >
                <span>{uploadingLogo || uploadingBanner ? "Uploading..." : "Next"}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: Admin-Published Promotion Date Selection (No Hourly Slots) */}
        {currentStep === 3 && (
          <section className="rounded-[16px] border border-[#232834] bg-[#14171E] p-4 sm:p-5 min-h-[520px] lg:min-h-[530px] lg:h-auto flex flex-col justify-between">
            <div className="space-y-3">
              <div className="space-y-1 border-b border-[#232834] pb-2.5">
                <div className="text-xs font-mono tracking-wide font-semibold rgb-text">
                  প্রচারণার সময়সূচি
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-white mt-0.5">
                  প্রমোশন প্রচারণার শুরুর তারিখ বেছে নিন
                </h2>
                <p className="text-xs text-neutral-400">
                  অ্যাডমিন কর্তৃক নির্ধারিত সক্রিয় তারিখগুলো থেকে আপনার প্রমোশন শুরুর দিনটি নির্বাচন করুন।
                </p>
              </div>

              {/* Date Selection List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    সক্রিয় প্রমোশন তারিখসমূহ
                  </label>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {loadingDates
                      ? "লোড হচ্ছে..."
                      : `${availableDates.filter((d) => !d.isBooked).length}টি খালি স্লট উপলব্ধ`}
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
                  <div className="max-h-[220px] sm:max-h-[240px] overflow-y-auto pr-1.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableDates.map((item) => {
                        const isSelected = selectedDate === item.date;
                        const isBooked = !!item.isBooked;
                        return (
                          <button
                            key={item.date}
                            type="button"
                            disabled={isBooked}
                            onClick={() => {
                              if (!isBooked) setSelectedDate(item.date);
                            }}
                            className={`px-3 py-2 rounded-[8px] border text-left transition-all flex items-center justify-between gap-2 ${
                              isBooked
                                ? "border-red-950/40 bg-[#120B0D] opacity-60 cursor-not-allowed"
                                : isSelected
                                ? "border-emerald-500 bg-[#14231E] text-white shadow-[0_0_15px_rgba(16,185,129,0.18)] cursor-pointer"
                                : "border-[#232834] bg-[#0C0E12] text-neutral-300 hover:border-neutral-600 hover:bg-[#11141B] cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`w-6 h-6 rounded-[5px] flex items-center justify-center shrink-0 border ${
                                  isSelected
                                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                    : "bg-[#14171E] border-[#232834] text-neutral-400"
                                }`}
                              >
                                <Calendar className="w-3 h-3" />
                              </div>
                              <div className="min-w-0">
                                <div
                                  className={`text-xs font-mono font-bold tracking-wide truncate ${
                                    isBooked ? "text-neutral-500 line-through" : "text-white"
                                  }`}
                                >
                                  {item.date}
                                </div>
                                {item.note && (
                                  <div className="text-[10px] text-neutral-400 truncate">
                                    {item.note}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isBooked ? (
                                <span
                                  className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold"
                                  style={{
                                    color: "#EF4444",
                                    backgroundColor: "rgba(239, 68, 68, 0.12)",
                                    borderColor: "rgba(239, 68, 68, 0.35)",
                                  }}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0" />
                                  বুকড
                                </span>
                              ) : isSelected ? (
                                <span
                                  className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shadow-sm"
                                  style={{
                                    backgroundColor: "#10B981",
                                    color: "#000000",
                                  }}
                                >
                                  <Check className="w-3 h-3" strokeWidth={3} />
                                  বাছাইকৃত
                                </span>
                              ) : (
                                <span
                                  className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold"
                                  style={{
                                    color: "#10B981",
                                    backgroundColor: "rgba(16, 185, 129, 0.12)",
                                    borderColor: "rgba(16, 185, 129, 0.35)",
                                  }}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                                  খালি
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Date Summary Strip */}
              {selectedDate && (
                <div className="p-2.5 sm:p-3 rounded-[8px] bg-[#0C0E12] border border-[#232834] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-[6px] bg-[#14231E] border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        নির্বাচিত প্রমোশন শুরুর তারিখ:{" "}
                        <span className="font-mono text-emerald-400 font-bold">{selectedDate}</span>
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        আপনার {videoCount}টি ভিডিওর ক্যাম্পেইন এই তারিখ থেকে শুরু হবে ({activeTier.bioDays} দিন বায়োতে লিংকসহ)।
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right font-mono text-[10px] text-neutral-400 shrink-0">
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
                className="inline-flex items-center justify-center gap-2 h-10 min-w-[100px] px-5 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-600 text-neutral-300 text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={
                  !selectedDate ||
                  !!availableDates.find((d) => d.date === selectedDate)?.isBooked ||
                  availableDates.length === 0
                }
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center justify-center gap-2 h-10 min-w-[100px] px-5 rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 4: Payment Settlement & Order Confirmation Only */}
        {currentStep === 4 && (
          <section
            className={`rounded-[16px] border border-[#232834] bg-[#14171E] p-4 sm:p-5 flex flex-col justify-between transition-all print:border-none print:bg-transparent print:p-0 print:m-0 print:shadow-none ${
              submitted ? "min-h-[450px] h-auto my-auto max-w-3xl mx-auto w-full" : "min-h-[520px] lg:h-[530px]"
            }`}
          >
            {/* Header: dynamically adapts if already submitted */}
            {submitted && submittedBooking ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#232834] pb-2.5 gap-1 no-print">
                <div>
                  <div className="text-xs font-mono tracking-wide font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    বুকিং সফলভাবে সম্পন্ন হয়েছে
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    অফিশিয়াল অর্ডার ইনভয়েস ও ডিজিটাল স্লিপ
                  </h2>
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  মেক্স তানিম প্রমোশন ডাটাবেজে কনফার্মড
                </div>
              </div>
            ) : (
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
            )}

            {submitted && submittedBooking ? (
              <div className="space-y-3 my-auto w-full animate-in fade-in zoom-in-95 duration-200 pt-1 print:pt-0">
                {/* OFFICIAL INVOICE / ORDER SLIP */}
                <div
                  id="printable-order-slip"
                  className="border border-[#232B3A] print:border-[#0F172A] print:border-[1.5px] bg-[#0A0D14] print:bg-white rounded-[12px] p-3.5 sm:p-4 print:p-6 space-y-2.5 print:space-y-4 shadow-xl print:shadow-none relative overflow-hidden print:text-[#0F172A]"
                >
                  {/* Decorative Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500" />

                  {/* Top Bar: Order ID + Status */}
                  <div className="flex items-center justify-between border-b border-[#1A2230] print:border-[#E2E8F0] pb-2 pt-0.5">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 print:text-emerald-700 font-bold">
                        MEX TANIM ESPORTS
                      </span>
                      <span className="text-neutral-600 print:text-neutral-400 text-xs">/</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm sm:text-base font-black text-white print:text-[#0F172A] font-mono tracking-wide">
                          #{submittedBooking.orderId}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(submittedBooking.orderId);
                            setCopiedSlip(true);
                            setTimeout(() => setCopiedSlip(false), 2000);
                          }}
                          className="p-1 rounded bg-[#141A24] hover:bg-[#1E2636] text-neutral-400 hover:text-white transition-colors no-print"
                          title="অর্ডার আইডি কপি করুন"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold ${
                          submittedBooking.status === "confirmed"
                            ? "bg-emerald-500/10 print:bg-emerald-50 border border-emerald-500/30 print:border-emerald-300 text-emerald-300 print:text-emerald-700"
                            : submittedBooking.status === "completed"
                            ? "bg-cyan-500/10 print:bg-cyan-50 border border-cyan-500/30 print:border-cyan-300 text-cyan-300 print:text-cyan-700"
                            : "bg-amber-500/10 print:bg-amber-50 border border-amber-500/30 print:border-amber-300 text-amber-300 print:text-amber-800"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            submittedBooking.status === "confirmed"
                              ? "bg-emerald-400"
                              : submittedBooking.status === "completed"
                              ? "bg-cyan-400"
                              : "bg-amber-400 animate-ping print:hidden"
                          }`}
                        />
                        {submittedBooking.status === "confirmed"
                          ? "কনফার্মড"
                          : submittedBooking.status === "completed"
                          ? "সম্পন্ন"
                          : "অপেক্ষমান (PENDING)"}
                      </span>
                      <span className="text-[10px] text-neutral-400 print:text-slate-600 font-mono hidden sm:inline-block">
                        ইস্যু: {submittedBooking.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Compact Unified Spec Grid */}
                  <div className="bg-[#06080D] print:bg-[#F8FAFC] border border-[#171D28] print:border-[#CBD5E1] rounded-[8px] divide-y divide-[#141A24] print:divide-[#E2E8F0] text-xs font-mono">
                    {/* Row 1: Client & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#141A24] print:divide-[#E2E8F0]">
                      <div className="px-3 py-1.5 sm:py-2 flex items-center justify-between gap-2">
                        <span className="text-neutral-400 print:text-slate-600 text-[11px] flex items-center gap-1.5 flex-shrink-0">
                          <Users2 className="w-3 h-3 text-neutral-500 print:text-slate-500" />
                          ক্লায়েন্ট:
                        </span>
                        <span className="text-white print:text-slate-900 font-semibold text-[11px] sm:text-xs truncate text-right">
                          {submittedBooking.clientName}
                        </span>
                      </div>
                      <div className="px-3 py-1.5 sm:py-2 flex items-center justify-between gap-2">
                        <span className="text-neutral-400 print:text-slate-600 text-[11px] flex items-center gap-1.5 flex-shrink-0">
                          <Smartphone className="w-3 h-3 text-emerald-400 print:text-emerald-700" />
                          যোগাযোগ (WA):
                        </span>
                        <span className="text-white print:text-slate-900 font-semibold text-[11px] sm:text-xs text-right">
                          {submittedBooking.phone}
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Medium & Package */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#141A24] print:divide-[#E2E8F0]">
                      <div className="px-3 py-1.5 sm:py-2 flex items-center justify-between gap-2">
                        <span className="text-neutral-400 print:text-slate-600 text-[11px] flex items-center gap-1.5 flex-shrink-0">
                          <Megaphone className="w-3 h-3 text-cyan-400 print:text-cyan-700" />
                          প্রচারের মাধ্যম:
                        </span>
                        <span className="text-emerald-400 print:text-emerald-700 font-semibold text-[11px] sm:text-xs text-right">
                          {submittedBooking.category}
                        </span>
                      </div>
                      <div className="px-3 py-1.5 sm:py-2 flex items-center justify-between gap-2">
                        <span className="text-neutral-400 print:text-slate-600 text-[11px] flex items-center gap-1.5 flex-shrink-0">
                          <Video className="w-3 h-3 text-purple-400 print:text-indigo-700" />
                          ভিডিও প্যাকেজ:
                        </span>
                        <span className="text-white print:text-slate-900 font-semibold text-[11px] sm:text-xs text-right">
                          {submittedBooking.videoCount}টি ভিডিও ({submittedBooking.bioLinkDays} দিন বায়োতে লিংক)
                        </span>
                      </div>
                    </div>

                    {/* Row 3: Promotion Date & Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#141A24] print:divide-[#E2E8F0]">
                      <div className="px-3 py-1.5 sm:py-2 flex items-center justify-between gap-2">
                        <span className="text-neutral-400 print:text-slate-600 text-[11px] flex items-center gap-1.5 flex-shrink-0">
                          <Calendar className="w-3 h-3 text-sky-400 print:text-sky-700" />
                          শুরুর তারিখ:
                        </span>
                        <span className="text-cyan-300 print:text-sky-700 font-bold text-[11px] sm:text-xs text-right">
                          {submittedBooking.selectedDate}
                        </span>
                      </div>
                      <div className="px-3 py-1.5 sm:py-2 flex items-center justify-between gap-2">
                        <span className="text-neutral-400 print:text-slate-600 text-[11px] flex items-center gap-1.5 flex-shrink-0">
                          <Gamepad2 className="w-3 h-3 text-amber-400 print:text-amber-700" />
                          টুর্নামেন্ট বিবরণ:
                        </span>
                        <span className="text-neutral-200 print:text-slate-800 text-[11px] sm:text-xs truncate max-w-[200px] text-right" title={submittedBooking.tournamentDetails}>
                          {submittedBooking.tournamentDetails}
                        </span>
                      </div>
                    </div>

                    {/* Row 4: Payment Method & TrxID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#141A24] print:divide-[#E2E8F0]">
                      <div className="px-3 py-1.5 sm:py-2 flex items-center justify-between gap-2">
                        <span className="text-neutral-400 print:text-slate-600 text-[11px] flex items-center gap-1.5 flex-shrink-0">
                          <CreditCard className="w-3 h-3 text-neutral-400 print:text-slate-500" />
                          পেমেন্ট মাধ্যম:
                        </span>
                        <span className="text-white print:text-slate-900 font-semibold text-[11px] sm:text-xs text-right">
                          {submittedBooking.paymentMethod}
                        </span>
                      </div>
                      <div className="px-3 py-1.5 sm:py-2 flex items-center justify-between gap-2">
                        <span className="text-neutral-400 print:text-slate-600 text-[11px] flex items-center gap-1.5 flex-shrink-0">
                          <Check className="w-3 h-3 text-emerald-400 print:text-emerald-700" />
                          ট্রানজেকশন ID:
                        </span>
                        <span className="text-emerald-300 print:text-emerald-700 font-mono font-bold text-[11px] sm:text-xs tracking-wider text-right">
                          {submittedBooking.trxId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Combined File & Price Status Bar */}
                  <div className="px-3 py-2 print:py-2.5 rounded-[8px] bg-[#07090E] print:bg-[#F0FDF4] border border-[#1C2331] print:border-[#86EFAC] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-neutral-400 print:text-emerald-800 text-[11px]">
                      <UploadCloud className="w-3.5 h-3.5 text-emerald-400 print:text-emerald-700 flex-shrink-0" />
                      <span>সংযুক্ত ফাইল:</span>
                      <span className="text-emerald-400 print:text-emerald-700 font-medium truncate">{submittedBooking.clientName} (আপলোড সম্পন্ন)</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-neutral-400 print:text-emerald-800 text-[11px]">মোট পরিশোধিত অগ্রিম:</span>
                      <span className="text-sm sm:text-base font-black text-emerald-400 print:text-emerald-700 font-mono tracking-tight">
                        ৳ {submittedBooking.totalPrice} টাকা (PAID)
                      </span>
                    </div>
                  </div>

                  {/* Compact Verification Line */}
                  <div className="pt-1 border-t border-[#161D29] print:border-[#E2E8F0] flex items-center justify-between text-[10px] font-mono text-neutral-400 print:text-slate-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 print:text-emerald-700" />
                      Mex Tanim Esports Engine // Verified
                    </span>
                    <span className="text-emerald-400 print:text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 print:bg-emerald-600" />
                      অর্ডারটি লাইভ সংরক্ষিত
                    </span>
                  </div>
                </div>

                {/* SLIP ACTION BUTTONS (Hidden in Print) */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 no-print">
                  {/* Download / Print Slip */}
                  <button
                    type="button"
                    onClick={handlePrintSlip}
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[6px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>প্রিন্ট / PDF</span>
                  </button>

                  {/* Text Slip File Download */}
                  <button
                    type="button"
                    onClick={handleDownloadSlipText}
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[6px] bg-[#14171E] hover:bg-[#1E232F] border border-[#232834] text-neutral-200 hover:text-white text-xs font-mono transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>টেক্সট রিসিট</span>
                  </button>

                  {/* Reset to new booking */}
                  <button
                    type="button"
                    onClick={handleResetForNewBooking}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] text-neutral-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                  >
                    নতুন বুকিং
                  </button>
                </div>
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
                          <span>বুকিং সাবমিশন তারিখ:</span>
                          <span className="text-white font-medium font-mono">
                            {new Date().toISOString().split("T")[0]}
                          </span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>প্রমোশন শুরুর তারিখ:</span>
                          <span className="text-emerald-400 font-medium font-mono">{selectedDate}</span>
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

                    <div
                      className="p-3 rounded-[8px] border flex items-center gap-2 text-[11px] font-mono shadow-sm"
                      style={{
                        backgroundColor: "rgba(239, 68, 68, 0.08)",
                        borderColor: "rgba(239, 68, 68, 0.35)",
                      }}
                    >
                      <ShieldAlert className="w-4 h-4 shrink-0" style={{ color: "#EF4444" }} />
                      <span className="font-semibold tracking-wide" style={{ color: "#F87171" }}>
                        ১০০% ফুল অ্যাডভান্স পেমেন্ট সম্পন্ন করার পরই স্লট নিশ্চিত হবে।
                      </span>
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
                        className="inline-flex items-center justify-center gap-2 h-10 min-w-[100px] px-5 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-600 text-neutral-300 text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4 shrink-0" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        disabled={submitting || !trxId.trim()}
                        className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
                      >
                        <span>{submitting ? "Confirming..." : "Order Confirm"}</span>
                        <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />
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
