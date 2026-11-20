"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  LogOut,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  KeyRound,
  X,
  Check,
  Copy,
  QrCode,
  Smartphone,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Printer,
  Settings,
  TrendingUp,
  Award,
} from "lucide-react";

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // 2FA login state
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  // Tab state
  const [activeTab, setActiveTab] = useState("dates"); // 'dates' | 'bookings'

  // Change Password Modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // 2FA Management Modal state
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState(1); // 1: initial, 2: scanning QR & entering code
  const [setupSecret, setSetupSecret] = useState("");
  const [setupQrUrl, setSetupQrUrl] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [twoFactorMsg, setTwoFactorMsg] = useState("");
  const [loading2FA, setLoading2FA] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Dates state
  const [dates, setDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [newDateNote, setNewDateNote] = useState("");
  const [dateActionMsg, setDateActionMsg] = useState("");
  const [msgFading, setMsgFading] = useState(false);
  const [selectedDatesList, setSelectedDatesList] = useState([]);
  const [currentCalDate, setCurrentCalDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // Close calendar popover on click or touch outside, or Escape key
  useEffect(() => {
    if (!showCalendar) return;

    const handleOutsideInteraction = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideInteraction);
    document.addEventListener("touchstart", handleOutsideInteraction, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCalendar]);

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState("");

  // Invoice Details Modal state
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Settings state
  const [settings, setSettings] = useState({
    bkashNumber: "01611657757",
    nagadNumber: "01611657757",
    rocketNumber: "01611657757",
    whatsappNumber: "8801611657757",
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState("");

  // Check auth on page load via HTTP-only Cookie
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const res = await fetch("/api/admin/check-auth");
        const json = await res.json();
        if (json.success && json.authenticated) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuthStatus();
  }, []);

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

  // Fetch data & 2FA status when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDates();
      fetchBookings();
      fetch2FAStatus();
      fetchSettings();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setLoggingIn(true);

    try {
      const payload = {
        username: username.trim(),
        password,
      };

      if (requires2FA) {
        payload.twoFactorCode = twoFactorCode.trim();
      }

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        if (json.requires2FA) {
          // Switch to 2FA Step
          setRequires2FA(true);
          setAuthError("");
        } else {
          setIsAuthenticated(true);
          setPassword("");
          setTwoFactorCode("");
          setRequires2FA(false);
        }
      } else {
        setAuthError(json.error || "ভুল ইউজারনেম বা পাসওয়ার্ড!");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setAuthError("নেটওয়ার্ক সমস্যা। পুনরায় চেষ্টা করুন।");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setRequires2FA(false);
    setTwoFactorCode("");
  };

  // 2FA Management
  const fetch2FAStatus = async () => {
    try {
      const res = await fetch("/api/admin/2fa");
      const json = await res.json();
      if (json.success) {
        setTwoFactorEnabled(json.twoFactorEnabled);
      }
    } catch (err) {
      console.error("Failed to fetch 2FA status:", err);
    }
  };

  const handleStart2FASetup = async () => {
    setLoading2FA(true);
    setTwoFactorMsg("");
    try {
      const res = await fetch("/api/admin/2fa", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setSetupSecret(json.secret);
        setSetupQrUrl(json.qrCodeUrl);
        setSetupStep(2);
      } else {
        setTwoFactorMsg("✕ " + (json.error || "2FA সেটআপ তৈরি করা যায়নি"));
      }
    } catch (err) {
      console.error("2FA setup error:", err);
      setTwoFactorMsg("✕ নেটওয়ার্ক সমস্যা হয়েছে।");
    } finally {
      setLoading2FA(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoading2FA(true);
    setTwoFactorMsg("");

    try {
      const res = await fetch("/api/admin/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: setupSecret, code: verifyCode.trim() }),
      });
      const json = await res.json();

      if (json.success) {
        setTwoFactorMsg("✓ " + json.message);
        setTwoFactorEnabled(true);
        setVerifyCode("");
        setTimeout(() => {
          setShow2FAModal(false);
          setSetupStep(1);
          setTwoFactorMsg("");
        }, 1800);
      } else {
        setTwoFactorMsg("✕ " + (json.error || "ভুল ওটিপি কোড"));
      }
    } catch (err) {
      console.error("2FA verify error:", err);
      setTwoFactorMsg("✕ নেটওয়ার্ক সমস্যা হয়েছে।");
    } finally {
      setLoading2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    const code = prompt("2FA বন্ধ করতে আপনার Authenticator অ্যাপ থেকে বর্তমান ৬-সংখ্যার কোডটি লিখুন:");
    if (!code) return;

    setLoading2FA(true);
    try {
      const res = await fetch("/api/admin/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = await res.json();

      if (json.success) {
        alert("✓ 2-Factor Authentication সফলভাবে নিষ্ক্রিয় করা হয়েছে।");
        setTwoFactorEnabled(false);
        setShow2FAModal(false);
        setSetupStep(1);
      } else {
        alert("✕ " + (json.error || "2FA নিষ্ক্রিয় করা যায়নি"));
      }
    } catch (err) {
      console.error("2FA disable error:", err);
    } finally {
      setLoading2FA(false);
    }
  };

  const copySecretKey = () => {
    if (setupSecret) {
      navigator.clipboard.writeText(setupSecret);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    setUpdatingPassword(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const json = await res.json();

      if (json.success) {
        setPasswordMsg("✓ " + json.message);
        setOldPassword("");
        setNewPassword("");
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordMsg("");
        }, 1500);
      } else {
        setPasswordMsg("✕ " + (json.error || "পাসওয়ার্ড পরিবর্তন করা যায়নি"));
      }
    } catch (err) {
      console.error("Change password error:", err);
      setPasswordMsg("✕ নেটওয়ার্ক সমস্যা হয়েছে।");
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Fetch Dates
  const fetchDates = async () => {
    setLoadingDates(true);
    try {
      const res = await fetch("/api/dates?all=true");
      const json = await res.json();
      if (json.success && Array.isArray(json.dates)) {
        setDates(json.dates);
      }
    } catch (err) {
      console.error("Failed to load dates:", err);
    } finally {
      setLoadingDates(false);
    }
  };

  // Toggle date in selected list
  const toggleDateSelection = (dStr) => {
    if (selectedDatesList.includes(dStr)) {
      setSelectedDatesList(selectedDatesList.filter((d) => d !== dStr));
    } else {
      setSelectedDatesList([...selectedDatesList, dStr].sort());
    }
  };

  // Remove date from selected list
  const removeDateFromList = (dStr) => {
    setSelectedDatesList(selectedDatesList.filter((d) => d !== dStr));
  };

  // Calendar calculations
  const calYear = currentCalDate.getFullYear();
  const calMonth = currentCalDate.getMonth();
  const monthNames = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  const dayLabels = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];
  const baseYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 9 }, (_, i) => baseYear - 1 + i);
  if (!yearOptions.includes(calYear)) {
    yearOptions.push(calYear);
    yearOptions.sort((a, b) => a - b);
  }
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const totalDays = new Date(calYear, calMonth + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentCalDate(new Date(calYear, calMonth - 1, 1));
  };
  const nextMonth = () => {
    setCurrentCalDate(new Date(calYear, calMonth + 1, 1));
  };
  const goToToday = () => {
    setCurrentCalDate(new Date());
  };

  // Show temporary date action message with smooth 3s fadeout
  const showDateMessage = (msg) => {
    setDateActionMsg(msg);
    setMsgFading(false);
    setTimeout(() => {
      setMsgFading(true);
    }, 2500);
    setTimeout(() => {
      setDateActionMsg("");
      setMsgFading(false);
    }, 3000);
  };

  // Add Date
  const handleAddDate = async (e) => {
    e.preventDefault();
    setDateActionMsg("");

    if (selectedDatesList.length === 0) {
      showDateMessage("অনুগ্রহ করে ক্যালেন্ডার থেকে এক বা একাধিক তারিখ সিলেক্ট করুন।");
      return;
    }

    try {
      const res = await fetch("/api/dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates: selectedDatesList, note: newDateNote }),
      });
      const json = await res.json();
      if (json.success) {
        showDateMessage(`✓ ${selectedDatesList.length}টি তারিখ সফলভাবে উন্মুক্ত করা হয়েছে!`);
        setSelectedDatesList([]);
        setNewDateNote("");
        setShowCalendar(false);
        fetchDates();
      } else {
        showDateMessage(json.error || "তারিখ যোগ করতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("Error adding dates:", err);
      showDateMessage("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    }
  };

  // Delete Date
  const handleDeleteDate = async (dateStr) => {
    if (!confirm(`আপনি কি নিশ্চিত যে ${dateStr} তারিখটি মুছে ফেলতে চান?`)) return;

    try {
      const res = await fetch(`/api/dates?date=${encodeURIComponent(dateStr)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        fetchDates();
      } else {
        alert(json.error || "মুছে ফেলা যায়নি");
      }
    } catch (err) {
      console.error("Error deleting date:", err);
    }
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch("/api/admin/bookings");
      const json = await res.json();
      if (json.success && Array.isArray(json.bookings)) {
        setBookings(json.bookings);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Update Booking Status
  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === "rejected") {
      const confirmed = confirm(
        `সতর্কতা: অর্ডার #${orderId} বাতিল করলে ক্লায়েন্টের স্লটটি আবার অন্য সবার জন্য উন্মুক্ত (Free) হয়ে যাবে। আপনি কি নিশ্চিত?`
      );
      if (!confirmed) return;
    }

    setUpdatingOrderId(orderId);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        fetchBookings();
        if (selectedInvoice && selectedInvoice.orderId === orderId) {
          setSelectedInvoice((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        alert(json.error || "স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingOrderId("");
    }
  };

  // Fetch Settings
  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (json.success && json.settings) {
        setSettings(json.settings);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoadingSettings(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (json.success) {
        setSettingsMsg("✓ " + (json.message || "সেটিংস সংরক্ষিত হয়েছে!"));
        setTimeout(() => setSettingsMsg(""), 3500);
      } else {
        setSettingsMsg("✕ " + (json.error || "সেটিংস সংরক্ষণ ব্যর্থ হয়েছে"));
      }
    } catch (err) {
      console.error("Save settings error:", err);
      setSettingsMsg("✕ নেটওয়ার্ক সমস্যা হয়েছে।");
    } finally {
      setSavingSettings(false);
    }
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone?.includes(searchQuery) ||
      b.trxId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Export Bookings to CSV
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      alert("এক্সপোর্ট করার মতো কোনো বুকিং পাওয়া যায়নি।");
      return;
    }

    const headers = [
      "Order ID",
      "Client Name",
      "Phone",
      "Target Medium",
      "Video Count",
      "Total Fee (BDT)",
      "Promotion Date",
      "Payment Channel",
      "TrxID",
      "Status",
      "Tournament Details",
      "Logo Link",
      "KYC Link",
      "Submission Date",
    ];

    const rows = filteredBookings.map((b) => [
      `"${b.orderId || ""}"`,
      `"${(b.clientName || "").replace(/"/g, '""')}"`,
      `"${(b.phone || "").replace(/"/g, '""')}"`,
      `"${(b.category || "").replace(/"/g, '""')}"`,
      `"${b.videoCount || 0}"`,
      `"${b.totalPrice || b.fee || 0}"`,
      `"${b.selectedDate || b.date || ""}"`,
      `"${b.paymentMethod || ""}"`,
      `"${(b.trxId || "").replace(/"/g, '""')}"`,
      `"${b.status || "pending"}"`,
      `"${(b.tournamentDetails || "").replace(/"/g, '""')}"`,
      `"${(b.orgLogoLink || "").replace(/"/g, '""')}"`,
      `"${(b.kycVerificationLink || "").replace(/"/g, '""')}"`,
      `"${b.createdAt ? new Date(b.createdAt).toLocaleString("bn-BD") : ""}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.href = url;
    link.setAttribute("download", `Mex_Tanim_Bookings_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI Calculations
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "approved" || b.status === "completed")
    .reduce((sum, b) => sum + (Number(b.totalPrice) || Number(b.fee) || 0), 0);

  const pendingCount = bookings.filter((b) => b.status === "pending" || !b.status).length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed" || b.status === "approved" || b.status === "completed").length;
  const totalSlotsCount = dates.length;

  // INITIAL AUTH LOADING SCREEN
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0C0E12] text-[#EDEDED] flex items-center justify-center">
        <div className="text-xs font-mono text-neutral-500 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C0E12] text-[#EDEDED] flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-[#232834] rounded-[16px] bg-[#14171E] p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="relative w-16 h-16 mx-auto">
              <Image
                src="/logo.png"
                alt="Mex Tanim Esports"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                MEX TANIM ESPORTS
              </h1>
              <p className="text-xs text-neutral-400 font-mono">
                {requires2FA
                  ? "২-ফ্যাক্টর অথেনটিকেশন (2FA)"
                  : "অ্যাডমিন কন্ট্রোল ডেস্ক (হ্যাশ সুরক্ষিত)"}
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-[8px] bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {!requires2FA ? (
            /* STEP 1: USERNAME & PASSWORD */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">
                  ইউজারনেম (Username)
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ইউজারনেম লিখুন"
                  className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">
                  পাসওয়ার্ড (Password)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3 rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                <Lock className="w-4 h-4" />
                {loggingIn ? "যাচাই করা হচ্ছে..." : "লগইন করুন"}
              </button>
            </form>
          ) : (
            /* STEP 2: 2FA CODE */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3 rounded-[8px] bg-[#0C0E12] border border-[#232834] text-center space-y-1">
                <Smartphone className="w-5 h-5 text-emerald-400 mx-auto" />
                <div className="text-xs text-white font-semibold">২-ফ্যাক্টর (2FA) কোড দিন</div>
                <p className="text-[11px] text-neutral-400">
                  আপনার মোবাইলের Authenticator অ্যাপে প্রদর্শিত ৬-সংখ্যার ওটিপি কোডটি লিখুন:
                </p>
              </div>

              <div>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="000000"
                  className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3.5 py-3 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRequires2FA(false);
                    setTwoFactorCode("");
                    setAuthError("");
                  }}
                  className="py-2.5 px-3 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-300 text-xs font-mono flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  পেছনে
                </button>
                <button
                  type="submit"
                  disabled={loggingIn || twoFactorCode.length !== 6}
                  className="flex-1 py-2.5 rounded-[8px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {loggingIn ? "যাচাই হচ্ছে..." : "যাচাই ও প্রবেশ করুন"}
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-2 border-t border-[#232834]">
            <Link
              href="/"
              className="text-xs text-neutral-500 hover:text-white transition-all"
            >
              ← মূল ওয়েবসাইটে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-[#0C0E12] text-[#EDEDED]">
      {/* Top Admin Header */}
      <header className="border-b border-[#232834] bg-[#14171E] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Mex Tanim Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2 leading-tight">
                <span>MEX TANIM</span>
                <span
                  className="text-xs sm:text-sm font-mono font-medium tracking-wide transition-colors duration-300"
                  style={{
                    color: "var(--rgb-current)",
                    textShadow: "0 0 10px var(--rgb-glow)",
                  }}
                >
                  অ্যাডমিন প্যানেল
                </span>
              </div>
              <div className="text-[11px] font-mono flex items-center gap-1.5 leading-none mt-1">
                <span className="text-white font-medium">Security:</span>
                {twoFactorEnabled ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>2FA Enabled</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-400 font-medium">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <span>2FA Disabled</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* 2FA Dedicated Button */}
            <button
              onClick={() => {
                setShow2FAModal(true);
                setSetupStep(1);
                setTwoFactorMsg("");
              }}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/[0.06] rounded-md transition-all flex items-center justify-center"
              title={twoFactorEnabled ? "2-Factor (2FA) সক্রিয়" : "2-Factor (2FA) নিষ্ক্রিয় - সেটআপ করুন"}
            >
              {twoFactorEnabled ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              )}
            </button>

            {/* Change Password Button */}
            <button
              onClick={() => setShowPasswordModal(true)}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/[0.06] rounded-md transition-all flex items-center justify-center"
              title="পাসওয়ার্ড পরিবর্তন করুন"
            >
              <KeyRound className="w-5 h-5 text-neutral-300 hover:text-white" />
            </button>

            {/* Live Site Link */}
            <Link
              href="/"
              target="_blank"
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/[0.06] rounded-md transition-all flex items-center justify-center"
              title="মূল লাইভ ওয়েবসাইট দেখুন"
            >
              <ExternalLink className="w-5 h-5 text-neutral-300 hover:text-white" />
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all flex items-center justify-center"
              title="লগআউট করুন"
            >
              <LogOut className="w-5 h-5 text-red-400 hover:text-red-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPI / Revenue Summary Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Revenue */}
          <div className="bg-[#14171E] border border-[#232834] rounded-[12px] p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                মোট আয় (Revenue)
              </div>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-1">
                BDT- {totalRevenue.toLocaleString()}
              </div>
            </div>
            <div className="w-10 h-10 rounded-[8px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Pending Bookings */}
          <div className="bg-[#14171E] border border-[#232834] rounded-[12px] p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                অপেক্ষমাণ (Pending)
              </div>
              <div className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-1">
                {pendingCount}টি
              </div>
            </div>
            <div className="w-10 h-10 rounded-[8px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Approved / Confirmed */}
          <div className="bg-[#14171E] border border-[#232834] rounded-[12px] p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                নিশ্চিত বুকিং
              </div>
              <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
                {confirmedCount}টি
              </div>
            </div>
            <div className="w-10 h-10 rounded-[8px] bg-[#1E2430] border border-[#2D364A] flex items-center justify-center text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          {/* Card 4: Open Slots */}
          <div className="bg-[#14171E] border border-[#232834] rounded-[12px] p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                উন্মুক্ত স্লট (Active)
              </div>
              <div className="text-lg sm:text-xl font-bold font-mono text-sky-400 mt-1">
                {totalSlotsCount}টি
              </div>
            </div>
            <div className="w-10 h-10 rounded-[8px] bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#232834] gap-2 pb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab("dates")}
            className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-t-[8px] transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "dates"
                ? "bg-[#14171E] border-t border-x border-[#232834] text-white border-b-transparent"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            তারিখ ও স্লট নিয়ন্ত্রণ ({dates.length})
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-t-[8px] transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "bookings"
                ? "bg-[#14171E] border-t border-x border-[#232834] text-white border-b-transparent"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            ক্লায়েন্ট বুকিং লেজার ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-t-[8px] transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "settings"
                ? "bg-[#14171E] border-t border-x border-[#232834] text-white border-b-transparent"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            পেমেন্ট ও অফিশিয়াল সেটিংস
          </button>
        </div>

        {/* TAB 1: DATE & SLOT MANAGER */}
        {activeTab === "dates" && (
          <div className="space-y-6">
            {/* Add Date Box with Trigger Button & Popover Calendar */}
            <div className="border border-[#232834] rounded-[14px] bg-[#14171E] p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#232834] pb-3">
                <div className="space-y-0.5">
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-400" />
                    নতুন প্রমোশন তারিখ উন্মুক্ত করুন (Open Available Dates)
                  </h2>
                  <p className="text-xs text-neutral-400">
                    ক্যালেন্ডার বাটনে চাপ দিয়ে ৬/৭টি তারিখ সিলেক্ট করুন এবং এক ক্লিকে যুক্ত করুন।
                  </p>
                </div>
              </div>

              {dateActionMsg && (
                <div
                  className={`p-2.5 rounded-[8px] text-xs font-mono flex items-center gap-2 transition-all duration-500 ${
                    msgFading ? "opacity-0 translate-y-[-4px]" : "opacity-100 translate-y-0"
                  } ${
                    dateActionMsg.startsWith("✓")
                      ? "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                      : "bg-red-950/40 border border-red-800 text-red-300"
                  }`}
                >
                  <span>{dateActionMsg}</span>
                </div>
              )}

              <form onSubmit={handleAddDate} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  {/* CALENDAR TRIGGER BUTTON (relative container for popover) */}
                  <div ref={calendarRef} className="sm:col-span-4 relative">
                    <label className="block text-xs font-mono text-neutral-300 mb-1">
                      প্রমোশনের তারিখ *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className={`w-full bg-[#0C0E12] border rounded-[8px] px-3.5 py-2.5 text-xs font-mono text-left flex items-center justify-between gap-2 transition-all ${
                        showCalendar
                          ? "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                          : "border-[#232834] hover:border-neutral-500"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-white truncate">
                        <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">
                          {selectedDatesList.length > 0
                            ? `${selectedDatesList.length}টি তারিখ নির্বাচিত`
                            : "তারিখ নির্বাচন করুন (ক্লিক)"}
                        </span>
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono flex-shrink-0">
                        {showCalendar ? "▲" : "▼"}
                      </span>
                    </button>

                    {/* POPUP CALENDAR */}
                    {showCalendar && (
                      <div className="absolute top-full left-0 mt-2 z-50 w-[320px] max-w-[calc(100vw-2rem)] bg-[#12151D] border border-[#2B3444] rounded-[12px] p-3 shadow-2xl space-y-2.5 backdrop-blur-md">
                        {/* Month & Year Selectors + Nav */}
                        <div className="flex items-center justify-between pb-2 border-b border-[#1E2330] gap-1">
                          <div className="flex items-center gap-1.5">
                            {/* Month Select */}
                            <select
                              value={calMonth}
                              onChange={(e) =>
                                setCurrentCalDate(new Date(calYear, parseInt(e.target.value), 1))
                              }
                              className="bg-[#181D26] hover:bg-[#202734] border border-[#2B3444] text-white text-[11px] font-mono rounded px-1.5 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer"
                            >
                              {monthNames.map((name, idx) => (
                                <option key={idx} value={idx} className="bg-[#12151D] text-white">
                                  {name}
                                </option>
                              ))}
                            </select>

                            {/* Year Select */}
                            <select
                              value={calYear}
                              onChange={(e) =>
                                setCurrentCalDate(new Date(parseInt(e.target.value), calMonth, 1))
                              }
                              className="bg-[#181D26] hover:bg-[#202734] border border-[#2B3444] text-white text-[11px] font-mono rounded px-1.5 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer"
                            >
                              {yearOptions.map((yr) => (
                                <option key={yr} value={yr} className="bg-[#12151D] text-white">
                                  {yr}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={goToToday}
                              className="text-[10px] font-mono px-1.5 py-1 rounded bg-[#181D26] hover:bg-[#202734] text-neutral-300 transition-colors"
                              title="আজকের তারিখে যান"
                            >
                              আজ
                            </button>
                            <button
                              type="button"
                              onClick={prevMonth}
                              className="p-1 rounded hover:bg-[#1E2330] text-neutral-400 hover:text-white"
                              title="আগের মাস"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={nextMonth}
                              className="p-1 rounded hover:bg-[#1E2330] text-neutral-400 hover:text-white"
                              title="পরের মাস"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Day labels */}
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-neutral-500">
                          {dayLabels.map((day, idx) => (
                            <div key={idx}>{day}</div>
                          ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="w-8 h-8" />
                          ))}

                          {Array.from({ length: totalDays }).map((_, i) => {
                            const dayNum = i + 1;
                            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                            const isSelected = selectedDatesList.includes(dateStr);
                            const isPublished = dates.some((item) => item.date === dateStr);

                            return (
                              <button
                                key={dateStr}
                                type="button"
                                onClick={() => toggleDateSelection(dateStr)}
                                className={`w-8 h-8 rounded-[6px] text-xs font-mono transition-all flex items-center justify-center cursor-pointer select-none relative ${
                                  isSelected
                                    ? "bg-emerald-500 text-black font-bold shadow-[0_0_8px_rgba(16,185,129,0.5)] scale-105"
                                    : isPublished
                                    ? "bg-[#141C24] text-emerald-400 border border-emerald-500/30 hover:border-emerald-400"
                                    : "bg-[#0C0E12] text-neutral-300 hover:bg-[#1A202C] hover:text-white border border-[#1E232F]"
                                }`}
                                title={isPublished ? `${dateStr} (উন্মুক্ত)` : dateStr}
                              >
                                <span>{dayNum}</span>
                                {isPublished && !isSelected && (
                                  <span className="w-1 h-1 rounded-full bg-emerald-400 absolute bottom-0.5" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Footer in Popover */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#1E2330]">
                          <span className="text-[11px] font-mono text-emerald-400 font-medium">
                            {selectedDatesList.length > 0 ? `${selectedDatesList.length}টি নির্বাচিত` : "তারিখ বেছে নিন"}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {selectedDatesList.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setSelectedDatesList([])}
                                className="text-[10px] text-neutral-400 hover:text-red-400 px-1.5 py-0.5 rounded font-mono transition-colors"
                              >
                                ক্লিয়ার
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setShowCalendar(false)}
                              className="px-2.5 py-1 rounded-[6px] bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-medium transition-colors"
                            >
                              সম্পন্ন (Done)
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* NOTE INPUT */}
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-mono text-neutral-300 mb-1">
                      নোট বা টুর্নামেন্ট বিবরণ (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={newDateNote}
                      onChange={(e) => setNewDateNote(e.target.value)}
                      placeholder="যেমন: উইকএন্ড মেগা টুর্নামেন্ট স্লট"
                      className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      disabled={selectedDatesList.length === 0}
                      className="w-full py-2.5 rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      {selectedDatesList.length > 0
                        ? `${selectedDatesList.length}টি তারিখ যুক্ত করুন`
                        : "তারিখ যুক্ত করুন"}
                    </button>
                  </div>
                </div>

                {/* Selected Date Tags below the input */}
                {selectedDatesList.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-neutral-400 mr-1">
                      বাছাইকৃত:
                    </span>
                    {selectedDatesList.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#181D26] border border-emerald-500/30 text-emerald-300 text-[11px] font-mono"
                      >
                        <span>{d}</span>
                        <button
                          type="button"
                          onClick={() => removeDateFromList(d)}
                          className="text-neutral-400 hover:text-red-400 ml-0.5"
                          title="বাদ দিন"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedDatesList([])}
                      className="text-[10px] text-neutral-500 hover:text-red-400 font-mono ml-1"
                    >
                      সব মুছুন
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Active Dates Table */}
            <div className="border border-[#232834] rounded-[16px] bg-[#14171E] overflow-hidden">
              <div className="p-4 border-b border-[#232834] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white">
                    বর্তমানে উন্মুক্ত তারিখসমূহ ({dates.length})
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    এই তারিখগুলো বর্তমানে মূল বুকিং ফর্মে ক্লায়েন্টদের জন্য দেখা যাচ্ছে।
                  </p>
                </div>
                <button
                  onClick={fetchDates}
                  disabled={loadingDates}
                  className="p-1.5 rounded-[6px] bg-[#0C0E12] border border-[#232834] text-neutral-400 hover:text-white transition-all"
                  title="রিফ্রেশ করুন"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingDates ? "animate-spin" : ""}`} />
                </button>
              </div>

              {dates.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500 font-mono">
                  কোনো তারিখ উন্মুক্ত নেই। উপরের ফর্ম থেকে তারিখ যোগ করুন।
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#0C0E12] text-neutral-400 uppercase tracking-wider border-b border-[#232834]">
                      <tr>
                        <th className="py-3 px-4">তারিখ</th>
                        <th className="py-3 px-4">নোট / বিবরণ</th>
                        <th className="py-3 px-4">অবস্থা (Status)</th>
                        <th className="py-3 px-4 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#232834]">
                      {dates.map((item) => (
                        <tr key={item.date} className="hover:bg-[#1B202A] transition-colors">
                          <td className="py-3 px-4 font-semibold text-white">
                            {item.date}
                          </td>
                          <td className="py-3 px-4 text-neutral-300">
                            {item.note || "—"}
                          </td>
                          <td className="py-3 px-4">
                            {item.isBooked ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-red-500/10 border border-red-500/30 text-red-400 text-[10px]">
                                বুকড (Booked)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                                উন্মুক্ত / খালি (Free)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteDate(item.date)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-red-950/40 border border-red-800 text-red-300 hover:bg-red-900/60 transition-all text-[11px]"
                            >
                              <Trash2 className="w-3 h-3" /> মুছে ফেলুন
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT & WHATSAPP SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-xl mx-auto">
            <div className="border border-[#232834] rounded-[12px] bg-[#14171E] p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="border-b border-[#232834] pb-3">
                <h2 className="text-xs font-semibold text-white flex items-center gap-2 uppercase font-mono tracking-wider">
                  <Settings className="w-3.5 h-3.5 text-emerald-400" />
                  পেমেন্ট মাধ্যম ও অফিশিয়াল যোগাযোগ সেটিংস
                </h2>
              </div>

              {settingsMsg && (
                <div
                  className={`p-2.5 rounded-[6px] text-xs font-mono flex items-center gap-2 ${
                    settingsMsg.startsWith("✓")
                      ? "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                      : "bg-red-950/40 border border-red-800 text-red-300"
                  }`}
                >
                  <span>{settingsMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* bKash */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      বিকাশ (bKash) নম্বর
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.bkashNumber || ""}
                      onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })}
                      placeholder="01611657757"
                      className="w-full bg-[#0C0E12] border border-[#232834] rounded-[6px] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Nagad */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      নগদ (Nagad) নম্বর
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.nagadNumber || ""}
                      onChange={(e) => setSettings({ ...settings, nagadNumber: e.target.value })}
                      placeholder="01611657757"
                      className="w-full bg-[#0C0E12] border border-[#232834] rounded-[6px] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Rocket */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      রকেট (Rocket) নম্বর
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.rocketNumber || ""}
                      onChange={(e) => setSettings({ ...settings, rocketNumber: e.target.value })}
                      placeholder="01611657757"
                      className="w-full bg-[#0C0E12] border border-[#232834] rounded-[6px] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      WhatsApp নম্বর (যেমন: 880...)
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.whatsappNumber || ""}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      placeholder="8801611657757"
                      className="w-full bg-[#0C0E12] border border-[#232834] rounded-[6px] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="w-full py-2 rounded-[6px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 shadow disabled:opacity-50 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {savingSettings ? "সংরক্ষণ হচ্ছে..." : "সেটিংস সংরক্ষণ করুন"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-[12px] bg-[#14171E] border border-[#232834] space-y-1">
                <div className="text-[11px] font-mono text-neutral-400">মোট বুকিং</div>
                <div className="text-xl font-bold font-mono text-white">{bookings.length}</div>
              </div>
              <div className="p-4 rounded-[12px] bg-[#14171E] border border-[#232834] space-y-1">
                <div className="text-[11px] font-mono text-neutral-400">পেন্ডিং যাচাইকরণ</div>
                <div className="text-xl font-bold font-mono text-yellow-400">
                  {bookings.filter((b) => b.status === "pending").length}
                </div>
              </div>
              <div className="p-4 rounded-[12px] bg-[#14171E] border border-[#232834] space-y-1">
                <div className="text-[11px] font-mono text-neutral-400">নিশ্চিত বুকিং</div>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-[12px] bg-[#14171E] border border-[#232834]">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="অর্ডার আইডি, ক্লায়েন্ট বা TrxID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-neutral-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">সকল স্ট্যাটাস</option>
                  <option value="pending">পেন্ডিং (Pending)</option>
                  <option value="confirmed">নিশ্চিত (Confirmed)</option>
                  <option value="rejected">বাতিল (Rejected)</option>
                </select>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium transition-all"
                  title="বুকিং তালিকা CSV ফাইল হিসেবে ডাউনলোড করুন"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV এক্সপোর্ট</span>
                </button>

                <button
                  onClick={fetchBookings}
                  disabled={loadingBookings}
                  className="p-2 rounded-[8px] bg-[#0C0E12] border border-[#232834] text-neutral-400 hover:text-white transition-all ml-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingBookings ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="border border-[#232834] rounded-[16px] bg-[#14171E] overflow-hidden">
              {filteredBookings.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500 font-mono">
                  কোনো বুকিং পাওয়া যায়নি।
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#0C0E12] text-neutral-400 uppercase tracking-wider border-b border-[#232834]">
                      <tr>
                        <th className="py-3 px-4">অর্ডার আইডি</th>
                        <th className="py-3 px-4">তারিখ ও স্লট</th>
                        <th className="py-3 px-4">ক্লায়েন্ট ও হোয়াটসঅ্যাপ</th>
                        <th className="py-3 px-4">প্যাকেজ ও মূল্য</th>
                        <th className="py-3 px-4">TrxID ও মেথড</th>
                        <th className="py-3 px-4">স্ট্যাটাস</th>
                        <th className="py-3 px-4 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#232834]">
                      {filteredBookings.map((b) => (
                        <tr key={b.orderId} className="hover:bg-[#1B202A] transition-colors">
                          <td className="py-3 px-4 font-bold text-white">
                            #{b.orderId}
                          </td>
                          <td className="py-3 px-4 space-y-0.5">
                            <div className="text-white font-medium">{b.selectedDate}</div>
                            <div className="text-[11px] text-neutral-400">{b.selectedTimeSlot}</div>
                          </td>
                          <td className="py-3 px-4 space-y-0.5">
                            <div className="text-white font-medium">{b.clientName}</div>
                            <div className="text-neutral-400">{b.phone}</div>
                          </td>
                          <td className="py-3 px-4 space-y-0.5">
                            <div className="text-white">{b.videoCount}টি ভিডিও</div>
                            <div className="text-emerald-400 font-bold">{b.totalPrice} ৳</div>
                          </td>
                          <td className="py-3 px-4 space-y-0.5">
                            <div className="text-white font-semibold">{b.trxId}</div>
                            <div className="text-[11px] text-neutral-400">{b.paymentMethod}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] uppercase font-semibold ${
                                b.status === "confirmed"
                                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                                  : b.status === "completed"
                                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                                  : b.status === "rejected"
                                  ? "bg-red-500/10 border border-red-500/30 text-red-400"
                                  : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Invoice Details */}
                              <button
                                type="button"
                                onClick={() => setSelectedInvoice(b)}
                                className="p-1.5 rounded-[6px] bg-[#0C0E12] border border-[#232834] hover:border-sky-500 text-neutral-300 hover:text-sky-400 transition-all"
                                title="ইনভয়েস স্লিপ ও পূর্ণাঙ্গ বিবরণ দেখুন"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>

                              {/* WhatsApp Direct Chat */}
                              <a
                                href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-[6px] bg-[#0C0E12] border border-[#232834] hover:border-emerald-500 text-neutral-300 hover:text-emerald-400 transition-all"
                                title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </a>

                              {/* Confirm Button */}
                              {b.status !== "confirmed" && b.status !== "completed" && (
                                <button
                                  onClick={() => handleStatusChange(b.orderId, "confirmed")}
                                  disabled={updatingOrderId === b.orderId}
                                  className="p-1.5 rounded-[6px] bg-emerald-950/40 border border-emerald-800 text-emerald-400 hover:bg-emerald-900/60 transition-all"
                                  title="পেমেন্ট অ্যাপ্রুভ করুন"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Mark Completed Button */}
                              {b.status === "confirmed" && (
                                <button
                                  onClick={() => handleStatusChange(b.orderId, "completed")}
                                  disabled={updatingOrderId === b.orderId}
                                  className="p-1.5 rounded-[6px] bg-cyan-950/40 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/60 transition-all"
                                  title="কাজ সম্পন্ন চিহ্নিত করুন (Mark Completed)"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Reject & Free Slot Button */}
                              {b.status !== "rejected" && (
                                <button
                                  onClick={() => handleStatusChange(b.orderId, "rejected")}
                                  disabled={updatingOrderId === b.orderId}
                                  className="p-1.5 rounded-[6px] bg-red-950/40 border border-red-800 text-red-400 hover:bg-red-900/60 transition-all"
                                  title="বাতিল ও স্লট মুক্ত করুন"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 2-FACTOR AUTHENTICATION (2FA) MODAL */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#14171E] border border-[#232834] rounded-[16px] p-5 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#232834] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">
                  ২-ফ্যাক্টর (2FA) নিরাপত্তা
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShow2FAModal(false);
                  setTwoFactorMsg("");
                  setSetupStep(1);
                }}
                className="w-7 h-7 rounded-[6px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {twoFactorMsg && (
              <div
                className={`p-3 rounded-[8px] text-xs font-mono flex items-center gap-2 ${
                  twoFactorMsg.startsWith("✓")
                    ? "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                    : "bg-red-950/40 border border-red-800 text-red-300"
                }`}
              >
                <span>{twoFactorMsg}</span>
              </div>
            )}

            {twoFactorEnabled ? (
              /* ALREADY ENABLED VIEW */
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">2-Factor Authentication সক্রিয় রয়েছে</div>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    আপনার অ্যাকাউন্ট সর্বোচ্চ নিরাপত্তায় সুরক্ষিত। প্রতিবার লগইন করতে Authenticator অ্যাপের ওটিপি কোড প্রয়োজন হবে।
                  </p>
                </div>

                <div className="pt-3 border-t border-[#232834]">
                  <button
                    type="button"
                    onClick={handleDisable2FA}
                    disabled={loading2FA}
                    className="px-4 py-2 rounded-[8px] bg-red-950/40 border border-red-800 text-red-300 hover:bg-red-900/60 text-xs font-mono transition-all"
                  >
                    2FA নিষ্ক্রিয় (Disable) করুন
                  </button>
                </div>
              </div>
            ) : setupStep === 1 ? (
              /* STEP 1: ENABLE PROMPT */
              <div className="space-y-4">
                <div className="p-4 rounded-[12px] bg-[#0C0E12] border border-[#232834] space-y-2">
                  <div className="flex items-center gap-2 text-white text-xs font-semibold">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    মোবাইল অথেনটিকেটর দিয়ে অ্যাকাউন্ট সুরক্ষিত করুন
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    ২-ফ্যাক্টর সক্রিয় করলে কেউ আপনার পাসওয়ার্ড জেনে গেলেও আপনার মোবাইলের ২-ফ্যাক্টর ওটিপি কোড ছাড়া কোনোভাবেই অ্যাকাউন্টে ঢুকতে পারবে না।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStart2FASetup}
                  disabled={loading2FA}
                  className="w-full py-3 rounded-[8px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  {loading2FA ? "কিউআর কোড তৈরি হচ্ছে..." : "QR Code দিয়ে 2FA সেটআপ করুন"}
                </button>
              </div>
            ) : (
              /* STEP 2: SCAN QR CODE & ENTER 6-DIGIT CODE */
              <div className="space-y-4">
                <div className="text-center space-y-3">
                  <p className="text-xs text-neutral-300">
                    ১. মোবাইলের <strong>Authenticator</strong> অ্যাপ খুলে <strong>+</strong> চাপ দিয়ে নিচের কিউআর কোডটি স্ক্যান করুন:
                  </p>

                  {/* QR Code Container */}
                  {setupQrUrl && (
                    <div className="inline-block p-3 bg-white rounded-[12px] shadow-lg mx-auto">
                      <img
                        src={setupQrUrl}
                        alt="2FA QR Code"
                        width={200}
                        height={200}
                        className="w-44 h-44 sm:w-48 sm:h-48 mx-auto"
                      />
                    </div>
                  )}

                  {/* Backup Secret Key */}
                  <div className="p-2.5 rounded-[8px] bg-[#0C0E12] border border-[#232834] flex items-center justify-between gap-2 max-w-sm mx-auto">
                    <div className="text-[11px] font-mono text-neutral-400 truncate">
                      Key: <span className="text-white font-semibold">{setupSecret}</span>
                    </div>
                    <button
                      type="button"
                      onClick={copySecretKey}
                      className="p-1.5 rounded-[6px] bg-[#14171E] border border-[#232834] hover:border-neutral-500 text-neutral-300 hover:text-white text-[11px] font-mono flex items-center gap-1 flex-shrink-0"
                    >
                      {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey ? "কপি হয়েছে" : "কপি"}</span>
                    </button>
                  </div>
                </div>

                {/* Form to submit 6-digit code */}
                <form onSubmit={handleVerify2FA} className="space-y-3 pt-2 border-t border-[#232834]">
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1 text-center">
                      ২. অ্যাপে ভেসে ওঠা ৬-সংখ্যার কোডটি লিখুন:
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      maxLength={6}
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="000000"
                      className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3.5 py-2.5 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSetupStep(1)}
                      className="py-2.5 px-4 rounded-[8px] bg-[#0C0E12] border border-[#232834] text-neutral-400 hover:text-white text-xs font-mono"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={loading2FA || verifyCode.length !== 6}
                      className="flex-1 py-2.5 rounded-[8px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {loading2FA ? "যাচাই হচ্ছে..." : "যাচাই ও সক্রিয় করুন"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#14171E] border border-[#232834] rounded-[16px] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#232834] pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-semibold text-white">
                  অ্যাডমিন পাসওয়ার্ড পরিবর্তন
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordMsg("");
                }}
                className="w-7 h-7 rounded-[6px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {passwordMsg && (
              <div
                className={`p-3 rounded-[8px] text-xs font-mono flex items-center gap-2 ${
                  passwordMsg.startsWith("✓")
                    ? "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                    : "bg-red-950/40 border border-red-800 text-red-300"
                }`}
              >
                <span>{passwordMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">
                  বর্তমান পুরাতন পাসওয়ার্ড *
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                  className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">
                  নতুন পাসওয়ার্ড *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="নতুন শক্তিশালী পাসওয়ার্ড লিখুন"
                  className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  * পাসওয়ার্ডটি স্বয়ংক্রিয়ভাবে ক্রিপ্টোগ্রাফিক সল্ট দিয়ে ডাটাবেসে হ্যাশ হয়ে সংরক্ষিত হবে।
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-[8px] bg-[#0C0E12] border border-[#232834] text-neutral-300 hover:text-white text-xs font-mono"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="px-5 py-2 rounded-[8px] bg-white hover:bg-neutral-200 text-[#0C0E12] text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  {updatingPassword ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE & ORDER DETAILS MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#14171E] border border-[#232834] rounded-[16px] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#232834] pb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Mex Tanim Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    MEX TANIM ESPORTS — INVOICE
                  </h3>
                  <div className="text-xs font-mono text-emerald-400 font-bold">
                    #{selectedInvoice.orderId}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-[6px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
                  title="প্রিন্ট করুন"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 rounded-[6px] bg-[#0C0E12] border border-[#232834] text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-[10px] bg-[#0C0E12] border border-[#232834] space-y-2">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                  ক্লায়েন্টের তথ্য
                </span>
                <div className="text-white font-bold text-sm">{selectedInvoice.clientName}</div>
                <div className="text-neutral-300 flex items-center justify-between">
                  <span>ফোন: {selectedInvoice.phone}</span>
                  <a
                    href={`https://wa.me/${selectedInvoice.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> চ্যাট
                  </a>
                </div>
                <div className="text-[11px] text-neutral-500">
                  আবেদন: {selectedInvoice.createdAt ? new Date(selectedInvoice.createdAt).toLocaleString("bn-BD") : "সম্প্রতি"}
                </div>
              </div>

              <div className="p-3.5 rounded-[10px] bg-[#0C0E12] border border-[#232834] space-y-2">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                  প্যাকেজ ও তারিখ
                </span>
                <div className="text-white font-semibold">
                  {selectedInvoice.category || "টুর্নামেন্ট প্রমোশন"}
                </div>
                <div className="text-neutral-300">
                  ভিডিও: <span className="text-white font-bold">{selectedInvoice.videoCount}টি</span>
                </div>
                <div className="text-neutral-300">
                  নির্ধারিত তারিখ: <span className="text-emerald-400 font-bold">{selectedInvoice.selectedDate || selectedInvoice.date}</span>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="p-4 rounded-[10px] bg-[#0C0E12] border border-[#232834] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                  পেমেন্ট মাধ্যম ও ট্রানজেকশন
                </span>
                <div className="text-xs text-neutral-300 mt-1">
                  মেথড: <span className="text-white font-bold">{selectedInvoice.paymentMethod || "bKash"}</span>
                </div>
                <div className="text-xs text-white font-bold flex items-center gap-2 mt-0.5">
                  <span>TrxID: {selectedInvoice.trxId}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedInvoice.trxId);
                      alert("TrxID কপি করা হয়েছে!");
                    }}
                    className="text-[10px] text-neutral-400 hover:text-white"
                    title="কপি করুন"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                  মোট প্রদেয় ফি
                </span>
                <div className="text-lg font-bold text-emerald-400">
                  BDT- {selectedInvoice.totalPrice || selectedInvoice.fee || 0}
                </div>
                <div className="text-[10px] text-neutral-400">১০০% ফুল অ্যাডভান্স</div>
              </div>
            </div>

            {/* Verification Links & Tournament Details */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-[10px] bg-[#0C0E12] border border-[#232834] space-y-1.5">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                  টুর্নামেন্ট / প্রমোশন বিবরণ:
                </span>
                <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {selectedInvoice.tournamentDetails || "কোনো বিশেষ বিবরণ দেওয়া হয়নি।"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-[8px] bg-[#0C0E12] border border-[#232834] flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">লোগো / ব্যানার ড্রাইভ লিংক:</span>
                  {selectedInvoice.orgLogoLink ? (
                    <a
                      href={selectedInvoice.orgLogoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400 hover:underline flex items-center gap-1 text-xs"
                    >
                      ড্রাইভ ফাইল ↗
                    </a>
                  ) : (
                    <span className="text-neutral-600">নেই</span>
                  )}
                </div>

                <div className="p-3 rounded-[8px] bg-[#0C0E12] border border-[#232834] flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">KYC / NID ভেরিফিকেশন:</span>
                  {selectedInvoice.kycVerificationLink ? (
                    <a
                      href={selectedInvoice.kycVerificationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400 hover:underline flex items-center gap-1 text-xs"
                    >
                      ড্রাইভ ফাইল ↗
                    </a>
                  ) : (
                    <span className="text-neutral-600">নেই</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="p-3 rounded-[10px] bg-[#0C0E12] border border-[#232834] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">বর্তমান স্ট্যাটাস:</span>
                <span
                  className={`px-2 py-0.5 rounded-[4px] text-[10px] uppercase font-bold ${
                    selectedInvoice.status === "confirmed"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : selectedInvoice.status === "rejected"
                      ? "bg-red-500/10 border border-red-500/30 text-red-400"
                      : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                  }`}
                >
                  {selectedInvoice.status || "pending"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedInvoice.status !== "confirmed" && selectedInvoice.status !== "completed" && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(selectedInvoice.orderId, "confirmed");
                      setSelectedInvoice({ ...selectedInvoice, status: "confirmed" });
                    }}
                    className="px-2.5 py-1 rounded-[6px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    অ্যাপ্রুভ করুন
                  </button>
                )}
                {selectedInvoice.status === "confirmed" && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(selectedInvoice.orderId, "completed");
                      setSelectedInvoice({ ...selectedInvoice, status: "completed" });
                    }}
                    className="px-2.5 py-1 rounded-[6px] bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    কাজ সম্পন্ন করুন
                  </button>
                )}
                {selectedInvoice.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(selectedInvoice.orderId, "rejected");
                      setSelectedInvoice({ ...selectedInvoice, status: "rejected" });
                    }}
                    className="px-2.5 py-1 rounded-[6px] bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    বাতিল করুন
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
