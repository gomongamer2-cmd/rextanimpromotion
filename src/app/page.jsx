"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
  MessageSquare,
  Menu,
  X,
  Play,
  Tv,
  Home,
  Code2,
} from "lucide-react";
import SupportChat from "../components/SupportChat";
import ThemeToggle from "../components/ThemeToggle";
import Preloader from "../components/Preloader";

// 3 Official Target Categories (Standard Titles, No Extra Text)
const CATEGORIES = [
  {
    id: "app-media",
    title: "Tournament Website",
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
      "অফিসিয়াল ক্যাম্পেইন সাপোর্ট (Campaign Support)",
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
      "অফিসিয়াল ক্যাম্পেইন সাপোর্ট (Campaign Support)",
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
      "ক্যাম্পেইন সাপোর্ট ও ব্র্যান্ডিং আইডিয়া শেয়ার",
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
      "Mex Tanim পার্সোনাল ও ডেডিকেটেড প্রমোশন সাপোর্ট",
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
      "Mex Tanim পার্সোনাল ও ডেডিকেটেড প্রমোশন সাপোর্ট",
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
      "Mex Tanim পার্সোনাল ও ডেডিকেটেড প্রমোশন সাপোর্ট",
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
      "Mex Tanim পার্সোনাল ও ডেডিকেটেড প্রমোশন সাপোর্ট",
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

  // Showreel Video Player state
  const [isPlayingShowreel, setIsPlayingShowreel] = useState(false);
  const showreelVideoRef = React.useRef(null);

  // Selections
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[2]); // Default: WhatsApp Group
  const [videoCount, setVideoCount] = useState(2);
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

  // NID & Birth Certificate Google Drive Upload States
  const [nidCertificateUrl, setNidCertificateUrl] = useState("");
  const [nidCertificateId, setNidCertificateId] = useState("");
  const [nidCertificatePreview, setNidCertificatePreview] = useState("");
  const [uploadingNid, setUploadingNid] = useState(false);
  const nidInputRef = React.useRef(null);
  const desktopNidRef = React.useRef(null);

  const [driveFolderUrl, setDriveFolderUrl] = useState("");
  const [driveFolderId, setDriveFolderId] = useState("");
  const [nameMissingWarning, setNameMissingWarning] = useState("");
  const nameInputRef = React.useRef(null);
  const phoneInputRef = React.useRef(null);
  const detailsInputRef = React.useRef(null);
  const logoInputRef = React.useRef(null);
  const bannerInputRef = React.useRef(null);
  const desktopNameRef = React.useRef(null);
  const desktopPhoneRef = React.useRef(null);
  const desktopDetailsRef = React.useRef(null);
  const desktopLogoRef = React.useRef(null);
  const desktopBannerRef = React.useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(null);

  // Synchronize activeNav when SupportChat opens or closes from internal controls
  useEffect(() => {
    const handleChatStatus = (e) => {
      if (e.detail?.isOpen) {
        setActiveNav("support");
      } else {
        setActiveNav((prev) => (prev === "support" ? null : prev));
      }
    };
    window.addEventListener("support-chat-status", handleChatStatus);
    return () => window.removeEventListener("support-chat-status", handleChatStatus);
  }, []);

  const handleNavClick = (link) => {
    const linkId = link.id || link.label;
    // If the clicked item is already active: toggle OFF (one click ON, another click OFF)
    if (activeNav === linkId) {
      setActiveNav(null);
      if (link.action === "open-chat" || linkId === "support") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("close-support-chat"));
        }
      }
      return;
    }

    // Otherwise: turn ON this item (mutually exclusive: turns previous one OFF)
    setActiveNav(linkId);

    if (link.action === "open-chat" || linkId === "support") {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("open-support-chat"));
      }
    } else {
      // Close support chat if open when switching to another section
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("close-support-chat"));
      }

      if (link.target === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(link.target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDesktopCombinedNext = () => {
    if (videoCount === 0) {
      showStep2Toast("অনুগ্রহ করে একটি ভিডিও প্যাকেজ বেছে নিন (১ থেকে ১০)", "name");
      return;
    }
    if (!clientName.trim()) {
      setNameMissingWarning("অনুগ্রহ করে ক্লায়েন্ট বা অরগানাইজেশনের নাম লিখুন");
      showStep2Toast("অনুগ্রহ করে ক্লায়েন্ট বা অরগানাইজেশনের নাম লিখুন", "name");
      desktopNameRef.current?.focus();
      return;
    }
    const cleanPhone = phone.replace("+880", "").replace(/\s/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      showStep2Toast("সঠিক ১০ ডিজিটের সক্রিয় WhatsApp নম্বর দিন", "phone");
      desktopPhoneRef.current?.focus();
      return;
    }
    if (!tournamentDetails.trim()) {
      showStep2Toast("প্রমোশন ও ক্যাম্পেইনের বিস্তারিত বিবরণ লিখুন", "details");
      desktopDetailsRef.current?.focus();
      return;
    }
    if (uploadingLogo || uploadingBanner || uploadingNid) {
      showStep2Toast("ফাইল আপলোড হওয়া পর্যন্ত অপেক্ষা করুন", "details");
      return;
    }
    setCurrentStep(3);
  };

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
      (desktopNameRef.current || nameInputRef.current)?.focus();
    } else if (fieldToFocus === "phone") {
      (desktopPhoneRef.current || phoneInputRef.current)?.focus();
    } else if (fieldToFocus === "details") {
      (desktopDetailsRef.current || detailsInputRef.current)?.focus();
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
Campaign / Promotion Details : ${submittedBooking.tournamentDetails}

PAYMENT DETAILS:
-----------------------------------------------------
Total Fee          : BDT ${submittedBooking.totalPrice}
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
    setNidCertificateUrl("");
    setNidCertificateId("");
    setNidCertificatePreview("");

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

  // Handle NID / Birth Certificate Upload to Google Drive (Under dedicated subfolder)
  const handleNidUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!clientName.trim()) {
      showStep2Toast("ফাইল আপলোড করার আগে অরগানাইজেশন বা ক্লায়েন্টের নাম লিখুন", "name");
      if (e.target) e.target.value = "";
      return;
    }

    setUploadingNid(true);
    setNameMissingWarning("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("clientName", clientName.trim());
      formData.append("type", "nid");
      if (nidCertificateId) formData.append("oldFileId", nidCertificateId);
      if (driveFolderId) formData.append("folderId", driveFolderId);
      if (driveFolderUrl) formData.append("folderUrl", driveFolderUrl);

      const res = await fetch("/api/upload/drive", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setNidCertificateUrl(data.fileUrl);
        setNidCertificateId(data.fileId);
        setNidCertificatePreview(data.thumbnailUrl || data.fileUrl);
        if (data.parentFolderId) setDriveFolderId(data.parentFolderId);
        else if (data.folderId) setDriveFolderId(data.folderId);
        if (data.parentFolderUrl) setDriveFolderUrl(data.parentFolderUrl);
        else if (data.folderUrl) setDriveFolderUrl(data.folderUrl);
      } else {
        alert(data.error || "NID / জন্ম সনদ আপলোড করা সম্ভব হয়নি।");
      }
    } catch (err) {
      console.error("NID upload error:", err);
      alert("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setUploadingNid(false);
      if (e.target) e.target.value = "";
    }
  };

  // Handle NID Removal (Deletes old file from Google Drive)
  const handleRemoveNid = async () => {
    const fileIdToDelete = nidCertificateId;
    setNidCertificateUrl("");
    setNidCertificateId("");
    setNidCertificatePreview("");

    if (fileIdToDelete) {
      try {
        await fetch(`/api/upload/drive?fileId=${encodeURIComponent(fileIdToDelete)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("Could not delete NID from Google Drive:", err);
      }
    }
  };

  // Step 2 Form Validation & Smooth Flow Transition
  const handleNextStep2 = () => {
    if (uploadingLogo || uploadingBanner || uploadingNid) {
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
      showStep2Toast("অনুগ্রহ করে Details Box এ প্রমোশনের প্রয়োজনীয় তথ্য দিন", "details");
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
    let lastUpdate = 0;
    let isScrolling = false;
    let scrollTimeout = null;

    const onScroll = () => {
      isScrolling = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const updateRGB = (timestamp) => {
      // Pause DOM property mutation while actively scrolling for pure 120fps locked scroll!
      if (!isScrolling && timestamp - lastUpdate >= 90) {
        lastUpdate = timestamp;
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
      }

      animId = requestAnimationFrame(updateRGB);
    };

    animId = requestAnimationFrame(updateRGB);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // Ultra-Smooth, Leak-Free Hero Interactive Mousemove (Zero layout thrashing)
  useEffect(() => {
    const el = document.getElementById("hero");
    if (!el) return;
    let rect = null;
    const updateRect = () => { rect = el.getBoundingClientRect(); };
    el.addEventListener("mouseenter", updateRect, { passive: true });
    window.addEventListener("resize", updateRect, { passive: true });

    let rafId = null;
    const handleMouseMove = (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!rect || rect.width === 0 || rect.height === 0) return;
        el.style.setProperty("--mx", String((e.clientX - rect.left) / rect.width - 0.5));
        el.style.setProperty("--my", String((e.clientY - rect.top) / rect.height - 0.5));
      });
    };
    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      el.removeEventListener("mouseenter", updateRect);
      window.removeEventListener("resize", updateRect);
      el.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [currentStep]);

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
      setSubmissionError("Please fill in all mandatory fields, including promotion details and TrxID.");
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
          nidCertificateUrl,
          nidCertificateId,
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
        nidCertificateUrl,
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
    <div className="min-h-screen flex flex-col justify-between bg-[#070806] text-[#f4f6f1] print:bg-white print:text-slate-900 selection:bg-[#FF2A3A] selection:text-black">
      {/* Cinematic Mex Tanim Preloader / Curtain Opening Screen */}
      <Preloader />

      {/* Top Glass Navigation Bar (Desktop + Mobile) */}
      <header className="sticky top-0 z-50 border-b border-[#ffffff14] bg-[#070806]/85 backdrop-blur-xl flex-shrink-0">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Mex Tanim Esports Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5 leading-tight">
                <span>MEX TANIM</span>
              </div>
              <div className="text-[10px] text-[#8f968a] font-mono tracking-normal leading-tight mt-0.5">
                Official Digital Media &amp; Promotion Agency
              </div>
            </div>
          </div>

          {/* Desktop Right Side: Nav Titles & Theme Toggle Aligned Together */}
          <div className="hidden lg:flex items-center gap-4">
            <nav className="flex items-center gap-1">
              {[
                { id: "home", label: "Home", target: "hero" },
                { id: "showcase", label: "Showcase", target: "streams-section" },
                { id: "services", label: "Services", target: "services-section" },
                { id: "book", label: "Book Package", target: "booking-portal" },
                { id: "support", label: "Support Inbox", action: "open-chat" },
              ].map((link) => {
                const isActive = activeNav === link.id;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleNavClick(link)}
                    style={
                      isActive
                        ? {
                            color: "var(--rgb-current)",
                            backgroundColor: "var(--rgb-subtle)",
                          }
                        : {}
                    }
                    className={`text-xs sm:text-[13px] font-mono font-medium transition-all duration-200 cursor-pointer px-3 py-1.5 rounded-full select-none border-0 outline-none shadow-none ${
                      isActive
                        ? "font-bold text-[var(--rgb-current)]"
                        : "text-[#8f968a] hover:text-[#f4f6f1] bg-transparent hover:bg-white/5"
                    }`}
                  >
                    <span
                      style={isActive ? { color: "var(--rgb-current)" } : {}}
                      className={isActive ? "font-bold tracking-tight" : "tracking-tight"}
                    >
                      {link.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="w-[1px] h-4 bg-neutral-300 dark:bg-white/10" />

            <ThemeToggle />
          </div>

          {/* Mobile Right: Theme Toggle & Menu Burger Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-full bg-[#10130e] border border-[#ffffff14] flex items-center justify-center text-[#f4f6f1] hover:text-[#FF2A3A] hover:border-[#FF2A3A]/50 transition-all cursor-pointer shadow-sm"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Animated Menu Drawer Overlay (Mex Tanim Clean Text Category with Icons) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 z-40 bg-[#070806]/98 [data-theme=light]:bg-white/98 backdrop-blur-2xl border-b border-[#ffffff14] p-5 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200 space-y-6">
          <div className="space-y-4">
            {/* Header Title */}
            <div className="flex items-center justify-between pb-2 border-b border-[#ffffff14]">
              <div className="text-[10px] font-mono uppercase text-[var(--rgb-current)] tracking-widest font-bold">
                NAVIGATION MENU
              </div>
              <span className="text-[10px] font-mono text-[#8f968a]">MEX TANIM</span>
            </div>

            {/* Nav Links - Clean Categories with Official Icons */}
            <div className="space-y-2">
              {[
                { id: "home", label: "Home (Hero)", target: "hero", icon: <Home className="w-4 h-4 shrink-0" /> },
                { id: "showcase", label: "Campaign Showcase", target: "streams-section", icon: <Play className="w-4 h-4 shrink-0" /> },
                { id: "services", label: "Services & What We Do", target: "services-section", icon: <Layers className="w-4 h-4 shrink-0" /> },
                { id: "book", label: "Book Promotion Package", target: "booking-portal", icon: <Calendar className="w-4 h-4 shrink-0" /> },
                { id: "support", label: "Direct Support Inbox", action: "open-chat", icon: <MessageSquare className="w-4 h-4 shrink-0" /> },
                { id: "gomon-hub", label: "GOMON HUB", action: "open-gomon-hub", icon: <Code2 className="w-4 h-4 shrink-0" /> },
              ].map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (item.action === "open-chat" || item.id === "support") {
                        setActiveNav("support");
                        if (typeof window !== "undefined") {
                          window.dispatchEvent(new CustomEvent("open-support-chat"));
                        }
                      } else if (item.action === "open-gomon-hub") {
                        if (typeof window !== "undefined") {
                          window.open("https://gomorportfolio-0s60.onrender.com", "_blank", "noopener,noreferrer");
                        }
                      } else {
                        handleNavClick(item);
                      }
                    }}
                    style={
                      isActive
                        ? {
                            color: "var(--rgb-current)",
                            backgroundColor: "var(--rgb-subtle)",
                          }
                        : {}
                    }
                    className={`w-full flex items-center justify-between p-4 rounded-[16px] text-left transition-all duration-200 border-0 outline-none shadow-none group cursor-pointer ${
                      isActive
                        ? "font-bold text-[var(--rgb-current)]"
                        : "bg-[#10130e] hover:bg-[#151912] text-[#f4f6f1]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-[var(--rgb-current)]" : "text-[#8f968a] group-hover:text-white transition-colors"}>
                        {item.icon}
                      </span>
                      <span
                        style={isActive ? { color: "var(--rgb-current)" } : {}}
                        className={`text-sm ${
                          isActive ? "font-bold text-[var(--rgb-current)]" : "font-medium text-[#f4f6f1] group-hover:text-white"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                        isActive ? "text-[var(--rgb-current)]" : "text-[#8f968a]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drawer Footer with Tactical Operational Badge */}
          <div className="pt-4 border-t border-[#ffffff14] flex items-center justify-between text-xs font-mono text-[#8f968a]">
            <span>Mex Tanim Esports © 2026</span>
            <div className="flex items-center gap-1.5">
              <span
                style={{
                  backgroundColor: "var(--rgb-current)",
                  boxShadow: "0 0 8px var(--rgb-glow)",
                }}
                className="w-2 h-2 rounded-full animate-pulse"
              />
              <span style={{ color: "var(--rgb-current)" }} className="font-bold text-[10px]">
                ONLINE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        {/* Mex Tanim HERO INTRO SECTION */}
        {currentStep === 1 && (
          <section
            id="hero"
            className="relative overflow-hidden w-full min-h-[580px] lg:min-h-[660px] py-12 px-4 flex flex-col items-center justify-center text-center space-y-6 no-print rounded-[32px] border border-[#ffffff10] bg-[#070806]"
          >
            {/* Cyber Matrix Blueprint Grid Background */}
            <div
              className="absolute inset-0 mex-pixgrid opacity-60 pointer-events-none"
              style={{
                WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 45%, #000 30%, transparent 80%)",
                maskImage: "radial-gradient(ellipse 75% 65% at 50% 45%, #000 30%, transparent 80%)",
              }}
            />

            {/* Glowing Cyber Crimson Radial Bloom in Center (Dark mode only) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(255,42,58,0.14),transparent_75%)] pointer-events-none [data-theme='light']_:hidden" />

            {/* Top Eyebrow Tactical Badge */}
            <div className="relative z-10 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#10130e]/90 border border-[#ffffff18] backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.7)] animate-in fade-in duration-700">
              <span className="w-2 h-2 rounded-full bg-[#FF2A3A] animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-[#FF2A3A] font-bold uppercase font-mono-tactical">
                PROMOTIONS WITH PURPOSE / 2026
              </span>
            </div>

            {/* Kinetic Monumental Mex Tanim Headline */}
            <div className="relative z-10 space-y-0.5 select-none max-w-4xl">
              <div
                className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black text-[#f4f6f1] tracking-[-0.05em] leading-[0.88] uppercase"
                style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
              >
                We promote
              </div>
              <div
                className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-normal italic text-[#FF2A3A] tracking-[-0.03em] leading-[0.92]"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                the moment.
              </div>
            </div>

            {/* Subtitle */}
            <p className="relative z-10 max-w-xl text-xs sm:text-sm lg:text-base text-[#8f968a] leading-relaxed">
              Mex Tanim delivers high-impact digital promotions, official brand showcase, and verified influencer marketing across gaming, social platforms, and digital media.
            </p>

            {/* Action Buttons */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("booking-portal");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-12 px-7 rounded-full bg-[#FF2A3A] hover:bg-[#E01E2E] text-[#070806] font-extrabold text-xs sm:text-sm flex items-center gap-2.5 shadow-[0_0_30px_rgba(255,42,58,0.45)] hover:shadow-[0_0_40px_rgba(255,42,58,0.6)] transition-all cursor-pointer font-mono-tactical"
              >
                <span>বুকিং শুরু করুন</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-support-chat"));
                  }
                }}
                className="h-12 px-6 rounded-full bg-[#10130e] hover:bg-[#151912] border border-[#ffffff18] text-[#f4f6f1] hover:text-[#FF2A3A] hover:border-[#FF2A3A]/50 text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer font-mono-tactical shadow-md"
              >
                <MessageSquare className="w-4 h-4 text-[#FF2A3A]" />
                <span>ইনবক্স / Q&amp;A ↗</span>
              </button>
            </div>

            {/* Tactical 4-Bar Segmented Progress Rail (Mex Tanim x-herorail) */}
            <div className="relative z-10 flex items-center gap-1.5 pt-2 max-w-[200px] w-full mx-auto">
              {[0, 1, 2, 3].map((bar) => (
                <div
                  key={bar}
                  className={`flex-1 h-[2px] rounded-full transition-all duration-500 ${
                    bar === 0
                      ? "bg-[#FF2A3A] shadow-[0_0_8px_#FF2A3A]"
                      : "bg-[#ffffff18]"
                  }`}
                />
              ))}
            </div>

            {/* DESKTOP 3D FLOATING TACTICAL PROPS (WITH MOUSE PARALLAX) */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none select-none overflow-hidden">
              {/* Prop 1: LIVE MATCH 12 Reach Metrics (Top-Left) */}
              <div
                className="absolute left-[5%] top-[12%] pointer-events-auto"
                style={{
                  transform:
                    "translate(calc(var(--mx, 0) * -22px), calc(var(--my, 0) * -18px))",
                }}
              >
                <div
                  className="w-[240px] rounded-[22px] bg-[#10130e]/95 border border-[#ffffff18] backdrop-blur-md p-3.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] text-left space-y-2.5 hover:border-[#FF2A3A]/40 transition-colors"
                  style={{
                    animation: "mex-float 8s ease-in-out infinite",
                    rotate: "-4deg",
                  }}
                >
                  <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF2A3A] text-[#070806] font-mono-tactical text-[9px] font-extrabold uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#070806] animate-ping" />
                        LIVE
                      </span>
                      <span className="font-mono-tactical text-[10px] text-white font-bold">MATCH 12</span>
                    </div>
                    <span className="font-mono-tactical text-[9px] text-[#8f968a]">12 SQUADS</span>
                  </div>

                  {/* 3-Row Campaign Reach Metrics */}
                  <div className="space-y-1 font-mono-tactical text-[10px]">
                    <div className="grid grid-cols-[20px_1fr_auto] items-center p-1.5 rounded-[8px] bg-[#FF2A3A18] border border-[#FF2A3A]/30 text-white font-bold">
                      <span className="text-[#FF2A3A]">01</span>
                      <span className="truncate">Mex Tanim Elite</span>
                      <span className="text-[#FF2A3A]">122 pts</span>
                    </div>
                    <div className="grid grid-cols-[20px_1fr_auto] items-center p-1.5 rounded-[8px] bg-[#ffffff06] text-[#8f968a]">
                      <span>02</span>
                      <span className="truncate">BD Vipers Pro</span>
                      <span>113 pts</span>
                    </div>
                    <div className="grid grid-cols-[20px_1fr_auto] items-center p-1.5 rounded-[8px] bg-[#ffffff06] text-[#8f968a]">
                      <span>03</span>
                      <span className="truncate">Dhaka Titans</span>
                      <span>104 pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prop 2: PEAK VIEWERS 48.2K Equalizer (Top-Right) */}
              <div
                className="absolute right-[5%] top-[14%] pointer-events-auto"
                style={{
                  transform:
                    "translate(calc(var(--mx, 0) * 22px), calc(var(--my, 0) * -22px))",
                }}
              >
                <div
                  className="w-[200px] rounded-[22px] bg-[#10130e]/95 border border-[#ffffff18] backdrop-blur-md p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] text-left flex flex-col gap-2.5 hover:border-[#FF2A3A]/40 transition-colors"
                  style={{
                    animation: "mex-float 7s ease-in-out infinite -3s",
                    rotate: "3deg",
                  }}
                >
                  <span className="font-mono-tactical text-[10px] text-[#8f968a] uppercase tracking-wider font-semibold">
                    PEAK VIEWERS
                  </span>
                  <span className="font-black text-3xl tracking-tight text-white leading-none font-mono-tactical">
                    48.2K
                  </span>
                  <div className="flex items-end gap-1.5 h-8 pt-1">
                    {[40, 65, 50, 85, 70, 100].map((h, i) => (
                      <span
                        key={i}
                        className={`flex-1 rounded-[3px] transition-all origin-bottom ${
                          h >= 85
                            ? "bg-[#FF2A3A] shadow-[0_0_10px_#FF2A3A]"
                            : "bg-[#ffffff20]"
                        }`}
                        style={{
                          height: `${h}%`,
                          animation: `mex-bars 3.6s ease-in-out infinite ${-0.4 * i}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Prop 3: CAM 03 Desk Monitor Feed (Bottom-Left) */}
              <div
                className="absolute left-[7%] bottom-[10%] pointer-events-auto"
                style={{
                  transform:
                    "translate(calc(var(--mx, 0) * -26px), calc(var(--my, 0) * 20px))",
                }}
              >
                <div
                  className="w-[230px] rounded-[22px] bg-[#10130e]/95 border border-[#ffffff18] backdrop-blur-md p-2.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] text-left space-y-2 hover:border-[#FF2A3A]/40 transition-colors"
                  style={{
                    animation: "mex-float 9s ease-in-out infinite -5s",
                    rotate: "5deg",
                  }}
                >
                  <div className="relative aspect-[16/10] rounded-[14px] overflow-hidden bg-[#070806] border border-[#ffffff10] flex items-center justify-center">
                    {/* Scanlines / Monitor Pattern */}
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 8px)",
                      }}
                    />
                    <div className="relative z-10 flex flex-col items-center gap-1 text-[#8f968a]">
                      <Tv className="w-6 h-6 text-[#FF2A3A]" />
                      <span className="font-mono-tactical text-[9px] uppercase tracking-wider text-white font-bold">
                        CASTER DESK FEED
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1.5 pt-0.5 text-xs font-mono-tactical">
                    <span className="font-semibold text-[#f4f6f1] text-[11px]">Desk feed · CAM 03</span>
                    <span className="flex items-center gap-1 text-[#FF2A3A] font-bold text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      REC
                    </span>
                  </div>
                </div>
              </div>

              {/* Prop 4: BRACKET · SEMIS (Bottom-Right) */}
              <div
                className="absolute right-[6%] bottom-[12%] pointer-events-auto"
                style={{
                  transform:
                    "translate(calc(var(--mx, 0) * 24px), calc(var(--my, 0) * 18px))",
                }}
              >
                <div
                  className="w-[210px] rounded-[22px] bg-[#10130e]/95 border border-[#ffffff18] backdrop-blur-md p-3.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] text-left flex flex-col gap-2.5 hover:border-[#FF2A3A]/40 transition-colors"
                  style={{
                    animation: "mex-float 7.5s ease-in-out infinite -1.5s",
                    rotate: "-3deg",
                  }}
                >
                  <div className="flex items-center justify-between border-b border-[#ffffff10] pb-1.5">
                    <span className="font-mono-tactical text-[10px] text-[#8f968a] uppercase font-bold tracking-wider">
                      BRACKET · SEMIS
                    </span>
                    <span className="font-mono-tactical text-[9px] text-[#FF2A3A] font-bold">STAGE 2</span>
                  </div>

                  {/* Campaign Conversion & ROI */}
                  <div className="grid grid-cols-[1fr_14px_1fr] items-center gap-1">
                    <div className="flex flex-col gap-1.5">
                      <span className="h-4 rounded-[5px] bg-[#FF2A3A22] border border-[#FF2A3A] flex items-center px-1 text-[8px] font-mono-tactical text-[#FF2A3A] font-bold truncate">MT Elite</span>
                      <span className="h-4 rounded-[5px] bg-[#ffffff08] flex items-center px-1 text-[8px] font-mono-tactical text-[#8f968a] truncate">Vipers</span>
                      <span className="h-4 rounded-[5px] bg-[#ffffff08] flex items-center px-1 text-[8px] font-mono-tactical text-[#8f968a] truncate">Titans</span>
                      <span className="h-4 rounded-[5px] bg-[#FF2A3A22] border border-[#FF2A3A] flex items-center px-1 text-[8px] font-mono-tactical text-[#FF2A3A] font-bold truncate">Apex</span>
                    </div>
                    <div className="h-[75%] border border-[#ffffff18] border-l-0 rounded-r-[5px]" />
                    <div className="flex flex-col justify-center gap-3">
                      <span className="h-4 rounded-[5px] bg-[#FF2A3A] text-[#070806] font-bold flex items-center px-1 text-[8px] font-mono-tactical shadow-[0_0_8px_#FF2A3A]">FINALIST</span>
                      <span className="h-4 rounded-[5px] bg-[#ffffff10] text-[#8f968a] flex items-center px-1 text-[8px] font-mono-tactical">SLOT 2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE TACTICAL PROPS GRID (2x2 Compact Cards) */}
            <div className="lg:hidden relative z-10 w-full max-w-sm grid grid-cols-2 gap-2 pt-2">
              <div className="rounded-[16px] bg-[#10130e] border border-[#ffffff14] p-3 text-left">
                <div className="flex items-center justify-between text-[10px] font-mono-tactical text-[#8f968a]">
                  <span className="text-[#FF2A3A] font-bold">● LIVE</span>
                  <span>MATCH 12</span>
                </div>
                <div className="text-xs font-bold text-white mt-1 truncate">Mex Tanim Elite</div>
                <div className="text-[10px] font-mono-tactical text-[#FF2A3A] mt-0.5">122 pts · Rank #1</div>
              </div>

              <div className="rounded-[16px] bg-[#10130e] border border-[#ffffff14] p-3 text-left flex flex-col justify-between">
                <div className="text-[10px] font-mono-tactical text-[#8f968a]">PEAK VIEWERS</div>
                <div className="text-lg font-black text-white font-mono-tactical">48.2K</div>
                <div className="flex items-end gap-1 h-3 pt-0.5">
                  {[40, 65, 85, 70, 100].map((h, i) => (
                    <span
                      key={i}
                      className="flex-1 bg-[#FF2A3A] rounded-[2px]"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[16px] bg-[#10130e] border border-[#ffffff14] p-3 text-left">
                <div className="text-[10px] font-mono-tactical text-[#8f968a] flex items-center justify-between">
                  <span>CAM 03</span>
                  <span className="text-[#FF2A3A] font-bold">REC</span>
                </div>
                <div className="text-xs font-bold text-white mt-1">Caster Desk</div>
                <div className="text-[10px] font-mono-tactical text-[#8f968a]">1080p 60FPS</div>
              </div>

              <div className="rounded-[16px] bg-[#10130e] border border-[#ffffff14] p-3 text-left">
                <div className="text-[10px] font-mono-tactical text-[#8f968a] flex items-center justify-between">
                  <span>BRACKET</span>
                  <span className="text-[#FF2A3A] font-bold">SEMIS</span>
                </div>
                <div className="text-xs font-bold text-white mt-1">98.6% Conversions</div>
                <div className="text-[10px] font-mono-tactical text-[#FF2A3A]">12 Squads Play</div>
              </div>
            </div>

            {/* Esports Tags Pills */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 pt-2">
              {["FREE FIRE", "TOURNAMENT WEBSITE", "WHATSAPP CHANNEL", "WHATSAPP GROUP", "1080P 60FPS", "LIVE PRODUCTION"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-[#10130e] border border-[#ffffff14] text-[10px] font-mono-tactical tracking-wider text-[#8f968a] hover:text-[#FF2A3A] hover:border-[#FF2A3A]/40 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}
        {/* Mex Tanim SECTION 2: FEATURED BROADCASTS & STREAMS */}
        {currentStep === 1 && (
          <section id="streams-section" className="w-full space-y-5 pt-4 pb-4 no-print">
            {/* Cinematic Showreel Showcase (Authentic Mex Tanim Cinema Player) */}
            <div className="relative w-full aspect-[16/9] max-h-[460px] rounded-[26px] overflow-hidden bg-[#0c100a] border border-[#ffffff18] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95)] flex items-center justify-center group">
              {/* Scanlines / CRT Scan Pattern */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none z-10"
                style={{
                  backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, transparent 1px, transparent 3px)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070806] via-transparent to-black/60 pointer-events-none z-10" />

              {/* Video Element */}
              <video
                ref={showreelVideoRef}
                src="/promo.mp4"
                poster="/promo_thumb.jpg"
                playsInline
                preload="none"
                controls={isPlayingShowreel}
                onPlay={() => setIsPlayingShowreel(true)}
                onEnded={() => setIsPlayingShowreel(false)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  isPlayingShowreel ? "opacity-100 relative z-30" : "opacity-75"
                }`}
              />

              {/* Showreel Overlay UI (Visible when not playing) */}
              {!isPlayingShowreel && (
                <>
                  {/* Top Left Live Badge */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10130e]/90 border border-[#ffffff18] backdrop-blur-md pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-[#FF2A3A] animate-pulse" />
                    <span className="text-[10px] font-mono-tactical text-white font-bold uppercase tracking-wider">
                      SHOWREEL · CINEMATIC EVENT FOOTAGE
                    </span>
                  </div>

                  {/* Center Pulsing Neon Play Button (Exact Dead Center) */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPlayingShowreel(true);
                        showreelVideoRef.current?.play();
                      }}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF2A3A] text-[#070806] flex items-center justify-center cursor-pointer transition-transform group-hover:scale-110 shadow-[0_0_40px_rgba(255,42,58,0.6)] focus:outline-none pointer-events-auto"
                      style={{ animation: "mex-play-pulse 3.2s ease-in-out infinite" }}
                      aria-label="Play showreel video"
                    >
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-[#070806] ml-1" />
                    </button>
                    <span className="absolute top-[calc(50%+46px)] sm:top-[calc(50%+54px)] text-xs font-mono-tactical text-[#8f968a] tracking-widest uppercase font-semibold whitespace-nowrap pointer-events-none">
                      [ SHOWREEL — CINEMATIC EVENT FOOTAGE ]
                    </span>
                  </div>

                  {/* Bottom Info Bar */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-xs font-mono-tactical text-[#8f968a] pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">MEX TANIM GRAND FINALS</span>
                      <span>·</span>
                      <span className="text-[#FF2A3A]">1080p 60FPS</span>
                    </div>
                    <span className="hidden sm:inline text-[11px] text-[#FF2A3A]">● LIVE BROADCAST ARCHIVE</span>
                  </div>
                </>
              )}

              {/* Close/Stop Video Button when playing */}
              {isPlayingShowreel && (
                <button
                  type="button"
                  onClick={() => {
                    if (showreelVideoRef.current) {
                      showreelVideoRef.current.pause();
                      showreelVideoRef.current.currentTime = 0;
                    }
                    setIsPlayingShowreel(false);
                  }}
                  className="absolute top-3 right-3 z-40 p-2 rounded-full bg-black/75 hover:bg-black text-white/80 hover:text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-lg"
                  title="ভিডিও বন্ধ করুন"
                  aria-label="Close video"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </section>
        )}

        {/* Mex Tanim SECTION 3: WHAT WE DO & SERVICES */}
        {currentStep === 1 && (
          <section id="services-section" className="w-full space-y-4 pt-2 pb-2 no-print">
            <div className="px-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#FF2A3A] font-bold">SERVICES</div>
              <h3 className="text-lg sm:text-xl font-bold text-[#f4f6f1]">We build. We promote. We produce.</h3>
              <p className="text-xs sm:text-sm text-[#8f968a] mt-0.5">
                Every promotional campaign on our official channels gets maximum audience retention and verified impressions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {[
                {
                  code: "01",
                  title: "Official Media Production",
                  desc: "Custom HUD, in-app fixture highlights, real-time match tracking and daily squad scrim slots.",
                  tag: "In-App Push · Daily 10K+ Reach",
                },
                {
                  code: "02",
                  title: "WhatsApp Official Channel Media",
                  desc: "1080p 60FPS video clip distribution directly to thousands of verified Free Fire gamers.",
                  tag: "Lifetime Archive · Direct Inbox",
                },
                {
                  code: "03",
                  title: "WhatsApp Group Bio Link Promotion",
                  desc: "Guaranteed top bio link spots on high-traffic channels and groups, with full 24/7 priority campaign support.",
                  tag: "High Conversion · Verified Link",
                },
              ].map((srv) => (
                <div
                  key={srv.code}
                  className="rounded-[20px] bg-[#10130e] border border-[#ffffff14] p-4 flex flex-col justify-between gap-3 shadow-[0_12px_24px_-12px_rgba(0,0,0,0.8)]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#FF2A3A] px-2.5 py-0.5 rounded-full bg-[#FF2A3A18] border border-[#FF2A3A]/30">
                        SERVICE {srv.code}
                      </span>
                      <span className="text-[10px] font-mono text-[#8f968a]">MEX TANIM ESPORTS</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-[#f4f6f1]">{srv.title}</h4>
                    <p className="text-xs text-[#8f968a] leading-relaxed">{srv.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-[#ffffff14] flex items-center justify-between text-[10px] font-mono text-[#FF2A3A]">
                    <span>{srv.tag}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("booking-portal");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-1 font-bold hover:underline cursor-pointer"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mex Tanim SECTION 4: WORK WITH US / PROMOTION BOOKING PORTAL */}
        <section id="booking-portal" className="w-full space-y-4 pt-4 pb-4 no-print">
          <div className="w-full px-1 text-center sm:text-left">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#FF2A3A] font-bold">WORK WITH US</div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#f4f6f1]">Official Promotion Booking Portal</h3>
            <p className="text-xs sm:text-sm text-[#8f968a] mt-1 max-w-xl">
              Choose your platform, specify video count, submit promotion assets, and receive official confirmation.
            </p>
          </div>

          {/* Stepper (Responsive Tactical Rail Style for Desktop & Mobile) */}
          <div className="w-full max-w-md mx-auto my-2">
            <div className="flex items-center justify-between bg-[#10130e] border border-[#ffffff14] rounded-full px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              {[
                { stepNum: 1, label: "Package" },
                { stepNum: 2, label: "Client Info" },
                { stepNum: 3, label: "Schedule" },
                { stepNum: 4, label: "Confirmation" }
              ].map(({ stepNum, label }, idx) => {
                const isCurrent = currentStep === stepNum;
                const isCompleted = currentStep > stepNum || (stepNum === 4 && submitted);
                const isClickable = isCompleted || stepNum < currentStep;

                return (
                  <React.Fragment key={stepNum}>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={!isClickable && !isCurrent}
                        onClick={() => {
                          if (isClickable) setCurrentStep(stepNum);
                        }}
                        className={`w-7 h-7 rounded-full font-mono text-[11px] font-bold flex items-center justify-center transition-all duration-300 shrink-0 select-none ${
                          isCurrent
                            ? "bg-[#FF2A3A] text-[#070806] font-extrabold shadow-[0_0_14px_rgba(255,42,58,0.65)] cursor-default ring-2 ring-[#FF2A3A]/30"
                            : isCompleted
                            ? "bg-[#FF2A3A24] border border-[#FF2A3A] text-[#FF2A3A] cursor-pointer"
                            : "bg-[#070806] border border-[#ffffff14] text-[#8f968a] opacity-50 cursor-not-allowed"
                        }`}
                        aria-label={`ধাপ ${stepNum}`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5 text-[#FF2A3A]" strokeWidth={2.5} /> : `0${stepNum}`}
                      </button>
                      <span className={`text-[11px] font-mono hidden sm:inline-block ${isCurrent ? "text-white font-bold" : isCompleted ? "text-[#FF2A3A]" : "text-[#8f968a]"}`}>
                        {label}
                      </span>
                    </div>

                    {idx < 3 && (
                      <div
                        className={`flex-1 h-[2px] mx-2 transition-all duration-500 rounded-full ${
                          currentStep > idx + 1 ? "bg-[#FF2A3A] shadow-[0_0_8px_rgba(255,42,58,0.4)]" : "bg-[#ffffff14]"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* STEP 1: Platform & 10-Tier Video Selection */}
          {currentStep === 1 && (
            <section className="w-full max-w-4xl mx-auto rounded-[22px] border border-[#ffffff14] bg-[#10130e] p-4 sm:p-5 space-y-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_48px_-24px_rgba(0,0,0,0.95)]">
            <div className="space-y-3.5">
              <div className="border-b border-[#ffffff14] pb-2 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider font-semibold text-[#FF2A3A] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A3A] animate-pulse" />
                    অফিশিয়াল প্রমোশন প্যাকেজ
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[#f4f6f1] mt-0.5">Choose a Platform &amp; Package</h2>
                </div>
              </div>

              {/* Medium Selection Row */}
              <div className="relative overflow-hidden rounded-[14px]">
                <div className="grid grid-cols-3 gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex flex-col items-center justify-center p-2 rounded-[12px] border text-center transition-all cursor-pointer gap-1 min-h-[58px] ${
                          isSelected
                            ? "bg-[#FF2A3A18] border-[#FF2A3A] shadow-[0_0_16px_rgba(255,42,58,0.22)]"
                            : "bg-[#070806] border-[#ffffff14] hover:border-[#ffffff26]"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-[6px] flex items-center justify-center shrink-0 ${isSelected ? "bg-[#FF2A3A] text-[#070806] font-bold shadow-sm" : "bg-[#10130e] text-[#8f968a] border border-[#ffffff14]"}`}>
                          {cat.id === "app-media" && <Gamepad2 className={`w-3.5 h-3.5 ${isSelected ? "text-[#070806]" : "text-[#FF2A3A]"}`} />}
                          {cat.id === "whatsapp-channel" && (
                            <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${isSelected ? "fill-[#070806]" : "fill-[#FF2A3A]"}`}>
                              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.4 1.01 2.57.13.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z"/>
                            </svg>
                          )}
                          {cat.id === "whatsapp-group" && (
                            <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${isSelected ? "fill-[#070806]" : "fill-[#FF2A3A]"}`}>
                              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.4 1.01 2.57.13.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z"/>
                            </svg>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold truncate max-w-full ${isSelected ? "text-white" : "text-[#8f968a]"}`}>{cat.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Numeric 1-10 Buttons */}
              <div className="rounded-[16px] border border-[#ffffff14] bg-[#070806] p-3.5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#ffffff14] pb-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#FF2A3A] font-bold">ভিডিও সংখ্যা বেছে নিন</span>
                  <span className="text-[10px] font-mono text-[#f4f6f1] font-bold">{videoCount}টি নির্বাচিত</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const isCurrent = videoCount === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setVideoCount(num)}
                        className={`py-2 rounded-[8px] text-center border text-xs font-mono font-bold transition-all ${
                          isCurrent
                            ? "bg-[#FF2A3A] text-[#070806] border-[#FF2A3A] shadow-[0_0_14px_rgba(255,42,58,0.5)]"
                            : "bg-[#10130e] border-[#ffffff14] text-[#8f968a] hover:text-white hover:border-[#ffffff26]"
                        }`}
                      >
                        {num < 10 ? `0${num}` : num}
                      </button>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-[#ffffff14] flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-[#8f968a]">মোট প্ল্যান ফি</div>
                    <div className="text-base font-bold text-[#FF2A3A]">৳ {activeTier.price} টাকা</div>
                  </div>
                  <div className="text-right text-[11px] text-[#f4f6f1] font-bold bg-[#ffffff0a] border border-[#ffffff14] px-2.5 py-0.5 rounded-full">
                    {activeTier.bioDays} দিন বায়ো লিংক
                  </div>
                </div>
              </div>

              {/* Mobile সুবিধা সমূহ Box */}
              <div className="rounded-[16px] border border-[#ffffff14] bg-[#070806] p-3.5 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF2A3A] font-bold flex items-center gap-1.5 border-b border-[#ffffff14] pb-1">
                  <Award className="w-3.5 h-3.5 text-[#FF2A3A]" />
                  <span>প্যাকেজ সুবিধা সমূহ ({selectedCategory.title})</span>
                </div>
                <div className="space-y-1 font-mono text-[10px]">
                  {[
                    "1080p 60FPS Full HD কোয়ালিটি",
                    "স্থায়ী লাইফটাইম আর্কাইভ গ্যারান্টি",
                    `${activeTier.bioDays} দিন নির্ধারিত বায়ো লিংক`,
                    "Mex Tanim Gaming অফিশিয়াল সাপোর্ট",
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[#8f968a]">
                      <Check className="w-3 h-3 text-[#FF2A3A] shrink-0" />
                      <span className="text-[#f4f6f1]">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ffffff14] flex items-center justify-between">
              <div className="text-xs font-mono text-[#8f968a]">{videoCount}টি ভিডিও — <span className="text-[#FF2A3A] font-bold">৳{activeTier.price}</span></div>
              <button
                type="button"
                disabled={videoCount === 0}
                onClick={() => { if (videoCount > 0) setCurrentStep(2); }}
                className={`inline-flex items-center justify-center gap-2 h-11 px-6 rounded-[12px] text-xs font-mono font-extrabold shadow-lg cursor-pointer transition-all ${
                  videoCount === 0 ? "bg-[#151912] text-[#626959]" : "bg-[#FF2A3A] text-[#070806] hover:bg-[#E01E2E] shadow-[0_0_20px_rgba(255,42,58,0.35)]"
                }`}
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

          {/* STEP 2: Client & Org Details + Google Drive Uploads */}
          {currentStep === 2 && (
            <section className="relative w-full max-w-4xl mx-auto rounded-[22px] border border-[#ffffff14] bg-[#10130e] p-4 sm:p-5 space-y-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_48px_-24px_rgba(0,0,0,0.95)]">
            <div className="space-y-3.5">
              <div className="border-b border-[#ffffff14] pb-2 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider font-semibold text-[#FF2A3A] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A3A] animate-pulse" />
                    ক্লায়েন্ট ও প্রমোশন বিবরণ
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[#f4f6f1] mt-0.5">আপনার প্রতিষ্ঠানের তথ্য দিন</h2>
                </div>
              </div>

              <div className="border border-[#ffffff14] rounded-[16px] bg-[#070806] p-3.5 space-y-3">
                <div>
                  <label className="text-xs font-mono text-[#8f968a] block mb-1">অরগানাইজেশন বা ক্লায়েন্টের নাম <span className="text-[#FF2A3A]">*</span></label>
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
                    className="w-full h-10 bg-[#10130e] border border-[#ffffff14] focus:border-[#FF2A3A] rounded-[10px] px-3 text-xs text-[#f4f6f1] placeholder-[#626959] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#8f968a] block mb-1">Active WhatsApp Number <span className="text-[#FF2A3A]">*</span></label>
                  <div className="relative flex items-center h-10 rounded-[10px] bg-[#10130e] border border-[#ffffff14] focus-within:border-[#FF2A3A]">
                    <div className="flex items-center gap-1 pl-3 pointer-events-none select-none shrink-0">
                      <span className="text-xs font-mono font-bold text-[#FF2A3A]">+880</span>
                    </div>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      required
                      inputMode="numeric"
                      placeholder="1XXXXXXXXX"
                      value={phone ? phone.replace("+880", "").trim() : ""}
                      onChange={(e) => {
                        let raw = e.target.value.replace(/\D/g, "");
                        if (raw.startsWith("880")) raw = raw.slice(3);
                        if (raw.startsWith("0")) raw = raw.slice(1);
                        const digits = raw.slice(0, 10);
                        setPhone(digits ? `+880 ${digits}` : "");
                      }}
                      className="w-full h-full bg-transparent px-2.5 text-xs text-[#f4f6f1] placeholder-[#626959] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#8f968a] block mb-1">Details Box <span className="text-[#FF2A3A]">*</span></label>
                  <textarea
                    ref={detailsInputRef}
                    rows={2}
                    required
                    placeholder="যেমন: Free Fire Squad Cup / PUBG Mobile Daily Scrims"
                    value={tournamentDetails}
                    onChange={(e) => setTournamentDetails(e.target.value)}
                    className="w-full bg-[#10130e] border border-[#ffffff14] rounded-[10px] px-3 py-2 text-xs text-[#f4f6f1] placeholder-[#626959] focus:outline-none focus:border-[#FF2A3A] resize-none"
                  />
                </div>

                {/* Mobile Uploads */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleLogoUpload} className="hidden" />
                    {!clientName.trim() ? (
                      <div onClick={() => showStep2Toast("আগে উপরে নাম লিখুন", "name")} className="border border-[#ffffff14] border-dashed rounded-[10px] bg-[#10130e] p-2.5 flex items-center gap-2 cursor-pointer opacity-60">
                        <Lock className="w-4 h-4 text-[#626959]" />
                        <span className="text-xs font-mono text-[#8f968a]">লোগো</span>
                      </div>
                    ) : uploadingLogo ? (
                      <div className="border border-[#FF2A3A]/40 rounded-[10px] bg-[#FF2A3A14] p-2.5 flex items-center justify-center gap-2 text-xs font-mono text-[#FF2A3A]">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading...
                      </div>
                    ) : orgLogoPreview ? (
                      <div className="border border-[#FF2A3A] rounded-[10px] bg-[#FF2A3A14] p-2 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2 truncate">
                          <img src={orgLogoPreview} alt="Logo" className="w-7 h-7 rounded object-cover" />
                          <span className="text-[#FF2A3A] font-semibold truncate">লোগো সম্পন্ন</span>
                        </div>
                        <button type="button" onClick={handleRemoveLogo} className="p-1 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <div onClick={() => logoInputRef.current?.click()} className="border border-[#ffffff1f] border-dashed rounded-[10px] bg-[#10130e] hover:border-[#FF2A3A]/60 p-2.5 flex items-center gap-2 cursor-pointer transition-colors">
                        <UploadCloud className="w-4 h-4 text-[#FF2A3A]" />
                        <span className="text-xs font-mono text-[#f4f6f1]">লোগো আপলোড</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <input ref={bannerInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleBannerUpload} className="hidden" />
                    {!clientName.trim() ? (
                      <div onClick={() => showStep2Toast("আগে উপরে নাম লিখুন", "name")} className="border border-[#ffffff14] border-dashed rounded-[10px] bg-[#10130e] p-2.5 flex items-center gap-2 cursor-pointer opacity-60">
                        <Lock className="w-4 h-4 text-[#626959]" />
                        <span className="text-xs font-mono text-[#8f968a]">ব্যানার</span>
                      </div>
                    ) : uploadingBanner ? (
                      <div className="border border-[#FF2A3A]/40 rounded-[10px] bg-[#FF2A3A14] p-2.5 flex items-center justify-center gap-2 text-xs font-mono text-[#FF2A3A]">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading...
                      </div>
                    ) : orgBannerPreview ? (
                      <div className="border border-[#FF2A3A] rounded-[10px] bg-[#FF2A3A14] p-2 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2 truncate">
                          <img src={orgBannerPreview} alt="Banner" className="w-9 h-6 rounded object-cover" />
                          <span className="text-[#FF2A3A] font-semibold truncate">ব্যানার সম্পন্ন</span>
                        </div>
                        <button type="button" onClick={handleRemoveBanner} className="p-1 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <div onClick={() => bannerInputRef.current?.click()} className="border border-[#ffffff1f] border-dashed rounded-[10px] bg-[#10130e] hover:border-[#FF2A3A]/60 p-2.5 flex items-center gap-2 cursor-pointer transition-colors">
                        <UploadCloud className="w-4 h-4 text-[#FF2A3A]" />
                        <span className="text-xs font-mono text-[#f4f6f1]">ব্যানার আপলোড</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <input ref={nidInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf" onChange={handleNidUpload} className="hidden" />
                    {!clientName.trim() ? (
                      <div onClick={() => showStep2Toast("আগে উপরে নাম লিখুন", "name")} className="border border-[#ffffff14] border-dashed rounded-[10px] bg-[#10130e] p-2.5 flex items-center gap-2 cursor-pointer opacity-60">
                        <Lock className="w-4 h-4 text-[#626959]" />
                        <span className="text-xs font-mono text-[#8f968a]">NID / জন্ম সনদ</span>
                      </div>
                    ) : uploadingNid ? (
                      <div className="border border-[#FF2A3A]/40 rounded-[10px] bg-[#FF2A3A14] p-2.5 flex items-center justify-center gap-2 text-xs font-mono text-[#FF2A3A]">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading...
                      </div>
                    ) : nidCertificatePreview ? (
                      <div className="border border-[#FF2A3A] rounded-[10px] bg-[#FF2A3A14] p-2 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2 truncate">
                          {nidCertificatePreview.includes(".pdf") ? (
                            <FileText className="w-6 h-6 text-[#FF2A3A] shrink-0 p-0.5 rounded bg-[#FF2A3A24] border border-[#FF2A3A]/40" />
                          ) : (
                            <img src={nidCertificatePreview} alt="NID" className="w-7 h-7 rounded object-cover" />
                          )}
                          <span className="text-[#FF2A3A] font-semibold truncate">NID সম্পন্ন</span>
                        </div>
                        <button type="button" onClick={handleRemoveNid} className="p-1 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <div onClick={() => nidInputRef.current?.click()} className="border border-[#ffffff1f] border-dashed rounded-[10px] bg-[#10130e] hover:border-[#FF2A3A]/60 p-2.5 flex items-center gap-2 cursor-pointer transition-colors">
                        <UploadCloud className="w-4 h-4 text-[#FF2A3A]" />
                        <span className="text-xs font-mono text-[#f4f6f1]">NID / জন্ম সনদ</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ffffff14] flex items-center justify-between">
              <button type="button" onClick={() => setCurrentStep(1)} className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-[12px] bg-[#070806] border border-[#ffffff14] text-[#8f968a] hover:text-[#f4f6f1] text-xs font-mono uppercase font-bold">
                <ArrowLeft className="w-4 h-4" /> <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[12px] bg-[#FF2A3A] hover:bg-[#E01E2E] text-[#070806] text-xs font-mono font-extrabold transition-all shadow-[0_0_20px_rgba(255,42,58,0.35)] cursor-pointer"
              >
                <span>
                  {uploadingLogo || uploadingBanner || uploadingNid ? "Uploading..." : "Next"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

          {/* STEP 3: Admin-Published Promotion Dates */}
          {currentStep === 3 && (
            <section className="w-full max-w-4xl mx-auto rounded-[22px] border border-[#ffffff14] bg-[#10130e] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_48px_-24px_rgba(0,0,0,0.95)] p-4 sm:p-6 lg:p-7 space-y-4">
            <div className="space-y-3">
              <div className="space-y-1 border-b border-[#232834] pb-2.5 flex items-start justify-between">
                <div>
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
              </div>

              {/* Date Selection List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FF2A3A]" />
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
                  <div className="max-h-[260px] sm:max-h-[300px] lg:max-h-[360px] overflow-y-auto pr-1.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
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
                                ? "border-[#FF2A3A] bg-[#2A080B] text-white shadow-[0_0_15px_rgba(255,42,58,0.25)] cursor-pointer"
                                : "border-[#232834] bg-[#0C0E12] text-neutral-300 hover:border-neutral-600 hover:bg-[#11141B] cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`w-6 h-6 rounded-[5px] flex items-center justify-center shrink-0 border ${
                                  isSelected
                                    ? "bg-[#FF2A3A]/20 border-[#FF2A3A]/50 text-[#FF2A3A]"
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
                    <div className="w-7 h-7 rounded-[6px] bg-[#2A080B] border border-[#FF2A3A]/40 text-[#FF2A3A] flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        নির্বাচিত প্রমোশন শুরুর তারিখ:{" "}
                        <span className="font-mono text-[#FF2A3A] font-bold">{selectedDate}</span>
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
                className={`inline-flex items-center justify-center gap-2 h-11 px-5 ${isDesktop ? "rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12]" : "rounded-[12px] bg-[#FF2A3A] hover:bg-[#E01E2E] text-[#070806] font-extrabold shadow-[0_0_20px_rgba(255,42,58,0.35)]"} text-xs font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer`}
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 4: Payment Settlement & Order Confirmation Only */}

          {/* STEP 4: Payment, TrxID & Digital Order Slip */}
          {currentStep === 4 && (
            <section
            className="w-full max-w-4xl mx-auto rounded-[22px] border border-[#ffffff14] bg-[#10130e] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_48px_-24px_rgba(0,0,0,0.95)] p-4 sm:p-6 lg:p-7 space-y-4"
          >
            {/* Header: dynamically adapts if already submitted */}
            {submitted && submittedBooking ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#232834] pb-2.5 gap-1 no-print">
                <div>
                  <div className="text-xs font-mono tracking-wide font-semibold text-[#FF2A3A] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF2A3A]" />
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
              <div className="space-y-1 border-b border-[#232834] pb-3 flex items-start justify-between">
                <div>
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
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF2A3A] via-red-500 to-rose-600" />

                  {/* Top Bar: Order ID + Status */}
                  <div className="flex items-center justify-between border-b border-[#1A2230] print:border-[#E2E8F0] pb-2 pt-0.5">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF2A3A] print:text-red-700 font-bold">
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
                            ? "bg-[#FF2A3A]/10 print:bg-red-50 border border-[#FF2A3A]/30 print:border-red-300 text-[#FF4A5A] print:text-red-700"
                            : submittedBooking.status === "completed"
                            ? "bg-red-500/10 print:bg-rose-50 border border-red-500/30 print:border-rose-300 text-[#FF4A5A] print:text-red-700"
                            : "bg-amber-500/10 print:bg-amber-50 border border-amber-500/30 print:border-amber-300 text-amber-300 print:text-amber-800"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            submittedBooking.status === "confirmed"
                              ? "bg-[#FF2A3A]"
                              : submittedBooking.status === "completed"
                              ? "bg-red-400"
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
                          <Smartphone className="w-3 h-3 text-[#FF2A3A] print:text-red-700" />
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
                          <Megaphone className="w-3 h-3 text-red-400 print:text-red-700" />
                          প্রচারের মাধ্যম:
                        </span>
                        <span className="text-[#FF2A3A] print:text-red-700 font-semibold text-[11px] sm:text-xs text-right">
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
                        <span className="text-[#FF4A5A] print:text-sky-700 font-bold text-[11px] sm:text-xs text-right">
                          {submittedBooking.selectedDate}
                        </span>
                      </div>
                      <div className="px-3 py-1.5 sm:py-2 flex items-center justify-between gap-2">
                        <span className="text-neutral-400 print:text-slate-600 text-[11px] flex items-center gap-1.5 flex-shrink-0">
                          <Gamepad2 className="w-3 h-3 text-amber-400 print:text-amber-700" />
                          প্রমোশন বিবরণ:
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
                          <Check className="w-3 h-3 text-[#FF2A3A] print:text-red-700" />
                          ট্রানজেকশন ID:
                        </span>
                        <span className="text-[#FF4A5A] print:text-red-700 font-mono font-bold text-[11px] sm:text-xs tracking-wider text-right">
                          {submittedBooking.trxId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Combined File & Price Status Bar */}
                  <div className="px-3 py-2 print:py-2.5 rounded-[8px] bg-[#07090E] print:bg-[#F0FDF4] border border-[#1C2331] print:border-[#86EFAC] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-neutral-400 print:text-red-800 text-[11px]">
                      <UploadCloud className="w-3.5 h-3.5 text-[#FF2A3A] print:text-red-700 flex-shrink-0" />
                      <span>সংযুক্ত ফাইল:</span>
                      <span className="text-[#FF2A3A] print:text-red-700 font-medium truncate">{submittedBooking.clientName} {submittedBooking.nidCertificateUrl ? "(লোগো, ব্যানার ও NID)" : "(লোগো ও ব্যানার সম্পন্ন)"}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-neutral-400 print:text-red-800 text-[11px]">মোট পরিশোধিত অগ্রিম:</span>
                      <span className="text-sm sm:text-base font-black text-[#FF2A3A] print:text-red-700 font-mono tracking-tight">
                        ৳ {submittedBooking.totalPrice} টাকা (PAID)
                      </span>
                    </div>
                  </div>

                  {/* Compact Verification Line */}
                  <div className="pt-1 border-t border-[#161D29] print:border-[#E2E8F0] flex items-center justify-between text-[10px] font-mono text-neutral-400 print:text-slate-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#FF2A3A] print:text-red-700" />
                      Mex Tanim Esports Engine // Verified
                    </span>
                    <span className="text-[#FF2A3A] print:text-red-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A3A] print:bg-red-600" />
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
                    <Download className="w-3.5 h-3.5 text-red-400" />
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
                        <span className="text-[#FF2A3A] font-bold">{videoCount}টি ভিডিও</span>
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
                          <span className="text-[#FF2A3A] font-medium font-mono">{selectedDate}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>বায়ো লিংক স্থায়িত্ব:</span>
                          <span className="text-[#FF2A3A] font-medium">{activeTier.bioDays} দিন বায়োতে লিংক</span>
                        </div>
                        <div className="border-t border-[#232834] pt-2.5 flex justify-between text-sm font-mono font-bold text-white">
                          <span>মোট অগ্রিম প্রদেয়:</span>
                          <span className="text-[#FF2A3A] font-bold text-base">৳ {activeTier.price} টাকা</span>
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
                          <CreditCard className="w-4 h-4 text-[#FF2A3A]" />
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
                                  ? "border-[#FF2A3A] text-[#FF2A3A] bg-[#2A080B] font-bold"
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
                          <div className="text-sm font-mono font-bold text-[#FF2A3A]">৳ {activeTier.price} টাকা</div>
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
                          className="w-full bg-[#14171E] border border-[#232834] rounded-[8px] px-3.5 py-2.5 text-xs font-mono uppercase text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF2A3A] transition-colors"
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
                        className={`inline-flex items-center justify-center gap-2 h-11 px-6 ${isDesktop ? "rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12]" : "rounded-[12px] bg-[#FF2A3A] hover:bg-[#E01E2E] text-[#070806] font-extrabold shadow-[0_0_20px_rgba(255,42,58,0.35)]"} text-xs font-mono uppercase tracking-wider font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer`}
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
        </section>

                {step2Toast && (
          <div className={`fixed bottom-14 lg:bottom-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 ease-out transform ${toastVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}`}>
            <div className="px-4 py-2.5 rounded-full bg-[#161B26]/95 backdrop-blur-md border border-[#232834] text-xs font-mono text-amber-300 shadow-2xl flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <span className="font-medium tracking-wide">{step2Toast}</span>
            </div>
          </div>
        )}
      </main>

      {/* Massive Monumental Professional Mex Tanim Footer (Exact High-End XTE Standard) */}
      <footer className="w-full pt-10 pb-12 px-4 sm:px-6 lg:px-8 text-[#8f968a] flex-shrink-0 no-print">
        <div className="w-full max-w-7xl mx-auto rounded-[28px] sm:rounded-[36px] bg-[#10130e] border border-[#ffffff14] p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl transition-all duration-300">
          {/* Top Radiant Glowing Accent Line */}
          <div
            style={{
              background: "linear-gradient(90deg, transparent, var(--rgb-current), transparent)",
            }}
            className="absolute top-0 left-0 right-0 h-[2px] opacity-75 pointer-events-none"
          />

          {/* Cyber Matrix Subtle Grid Background */}
          <div className="mex-pixgrid absolute inset-0 opacity-15 pointer-events-none" />

          {/* Main 3-Column Layout */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Column 1: Brand & About */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 flex-shrink-0">
                  <Image src="/logo.png" alt="Mex Tanim" width={36} height={36} className="object-contain" />
                </div>
                <div>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    <span>MEX TANIM</span>
                    <span style={{ color: "var(--rgb-current)" }} className="font-mono text-xs font-bold">/ 2026</span>
                  </div>
                  <div className="text-[11px] text-[#8f968a] font-mono">
                    Official Digital Media &amp; Promotion Agency
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#8f968a] leading-relaxed max-w-xs">
                Official digital media and promotional service agency in Bangladesh. We produce verified, high-impact campaigns, video packages, and audience reach for creators and brands.
              </p>

              {/* Social Channels with RGB Hover */}
              <div className="flex items-center gap-2 pt-1">
                {[
                  {
                    href: "https://whatsapp.com/channel/0029Vb6F0j54Y9lssQHIcv0s",
                    label: "WhatsApp",
                    icon: (
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.8" fill="none">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://t.me/mextanimesports",
                    label: "Telegram",
                    icon: (
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.8" fill="none">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://youtube.com/@mextanimesports?si=ws5SDD5GgPzZSoIV",
                    label: "YouTube",
                    icon: (
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.8" fill="none">
                        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                        <polygon points="10 15 15 12 10 9 10 15" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://discord.gg/HCcsKvFh9d",
                    label: "Discord",
                    icon: (
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.8" fill="none">
                        <path d="M18 6h0a14.5 14.5 0 0 0-4-1.5c-.2.4-.4.9-.6 1.4a13.3 13.3 0 0 0-3.8 0c-.2-.5-.4-1-.6-1.4A14.5 14.5 0 0 0 5 6a16.6 16.6 0 0 0-3 12c2 1.5 4 2.5 6 2.5.5-.6.9-1.3 1.3-2-1-.4-1.5-.9-2-1.5.2.1.3.2.5.3 2.5 1.2 5 1.2 7.4 0 .2-.1.4-.2.5-.3-.5.6-1 1.1-2 1.5.4.7.8 1.4 1.3 2 2 0 4-1 6-2.5 0-4-.5-8.5-3-12z" />
                        <circle cx="8.5" cy="12.5" r="1" />
                        <circle cx="15.5" cy="12.5" r="1" />
                      </svg>
                    ),
                  },
                ].map((s, idx) => (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full bg-[#151912] border border-[#ffffff14] text-[#8f968a] hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--rgb-border)";
                      e.currentTarget.style.boxShadow = "0 0 12px var(--rgb-glow)";
                      e.currentTarget.style.color = "var(--rgb-current)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.boxShadow = "";
                      e.currentTarget.style.color = "";
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Services & Media */}
            <div className="space-y-3">
              <div
                style={{ color: "var(--rgb-current)" }}
                className="text-[11px] font-mono uppercase tracking-widest font-bold"
              >
                SERVICES &amp; PACKAGES
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("booking-portal");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[#8f968a] hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                  >
                    <span className="text-[10px] text-[var(--rgb-current)] font-mono">01</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">WhatsApp Channel Videos</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("booking-portal");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[#8f968a] hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                  >
                    <span className="text-[10px] text-[var(--rgb-current)] font-mono">02</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">WhatsApp Group Bio Promotion</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("booking-portal");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[#8f968a] hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                  >
                    <span className="text-[10px] text-[var(--rgb-current)] font-mono">03</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Official YouTube Showreels</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("booking-portal");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[#8f968a] hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                  >
                    <span className="text-[10px] text-[var(--rgb-current)] font-mono">04</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Priority Slot Reservations</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("booking-portal");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[#8f968a] hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                  >
                    <span className="text-[10px] text-[var(--rgb-current)] font-mono">05</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Instant Verified Booking Slip</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Navigation */}
            <div className="space-y-3">
              <div
                style={{ color: "var(--rgb-current)" }}
                className="text-[11px] font-mono uppercase tracking-widest font-bold"
              >
                QUICK NAVIGATION
              </div>
              <ul className="space-y-2 text-xs">
                {[
                  { id: "home", label: "Home (Hero Section)", target: "hero" },
                  { id: "showcase", label: "Campaign Showcase", target: "streams-section" },
                  { id: "services", label: "Services & What We Do", target: "services-section" },
                  { id: "book", label: "Book Official Package", target: "booking-portal" },
                  { id: "support", label: "24/7 AI Support Inbox", action: "open-chat" },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item)}
                      className="text-[#8f968a] hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                    >
                      <ArrowRight className="w-3 h-3 text-[var(--rgb-current)] group-hover:translate-x-0.5 transition-transform" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Tactical System Beacon */}
          <div className="relative z-10 mt-10 pt-6 border-t border-[#ffffff14] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="text-center sm:text-left text-[#8f968a]">
              <span>MEX TANIM ESPORTS © 2026. ALL RIGHTS RESERVED.</span>
            </div>

            {/* Developer Credit Link (GOMON HUB Direct Portal) */}
            <div className="text-center">
              <a
                href="https://gomorportfolio-0s60.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#8f968a] hover:text-white transition-colors cursor-pointer group"
              >
                <span>Engineered by</span>
                <span style={{ color: "var(--rgb-current)" }} className="font-bold underline group-hover:opacity-80">
                  GOMON HUB
                </span>
                <span className="text-[10px] text-[#8f968a]">↗</span>
              </a>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#151912] border border-[#ffffff14] shadow-sm">
              <span
                style={{
                  backgroundColor: "var(--rgb-current)",
                  boxShadow: "0 0 8px var(--rgb-glow)",
                }}
                className="w-2 h-2 rounded-full animate-pulse"
              />
              <span style={{ color: "var(--rgb-current)" }} className="font-bold tracking-wider text-[11px]">
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* 24/7 AI Live Support Floating Widget */}
      <SupportChat />
    </div>
  );
}
