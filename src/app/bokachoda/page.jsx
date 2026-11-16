"use client";

import { useState, useEffect } from "react";
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
  Search,
  Filter,
  KeyRound,
  X,
  Check,
} from "lucide-react";

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState("dates"); // 'dates' | 'bookings'

  // Change Password Modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Dates state
  const [dates, setDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newDateNote, setNewDateNote] = useState("");
  const [dateActionMsg, setDateActionMsg] = useState("");

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState("");

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

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDates();
      fetchBookings();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const json = await res.json();

      if (json.success) {
        setIsAuthenticated(true);
        setPassword("");
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
  };

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
      const res = await fetch("/api/dates");
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

  // Add Date
  const handleAddDate = async (e) => {
    e.preventDefault();
    setDateActionMsg("");

    if (!newDate) {
      setDateActionMsg("অনুগ্রহ করে একটি তারিখ নির্বাচন করুন।");
      return;
    }

    try {
      const res = await fetch("/api/dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate, note: newDateNote }),
      });
      const json = await res.json();
      if (json.success) {
        setDateActionMsg("✓ নতুন তারিখ সফলভাবে উন্মুক্ত করা হয়েছে!");
        setNewDate("");
        setNewDateNote("");
        fetchDates();
      } else {
        setDateActionMsg(json.error || "তারিখ যোগ করতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("Error adding date:", err);
      setDateActionMsg("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
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
      } else {
        alert(json.error || "স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingOrderId("");
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

  // INITIAL AUTH LOADING SCREEN
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0C0E12] text-[#EDEDED] flex items-center justify-center">
        <div className="text-xs font-mono text-neutral-500 animate-pulse">
          নিরাপদ সেশন যাচাই করা হচ্ছে...
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C0E12] text-[#EDEDED] flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-[#232834] rounded-[16px] bg-[#14171E] p-8 space-y-6">
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
                অ্যাডমিন কন্ট্রোল ডেস্ক (হ্যাশ সুরক্ষিত)
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-[8px] bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

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
                className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D81F26]"
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
                className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D81F26]"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-[8px] bg-[#D81F26] hover:bg-[#B9151B] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {loggingIn ? "যাচাই করা হচ্ছে..." : "লগইন করুন"}
            </button>
          </form>

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
            <div className="relative w-9 h-9 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Mex Tanim Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                MEX TANIM
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-[4px] bg-[#D81F26] text-white">
                  অ্যাডমিন প্যানেল
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                স্ট্যাটাস: <span className="text-emerald-400">হ্যাশ সুরক্ষিত (Hashed & Salted)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-300 transition-all font-mono"
            >
              <KeyRound className="w-3.5 h-3.5 text-yellow-400" />
              পাসওয়ার্ড বদলান
            </button>
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-[8px] bg-[#0C0E12] border border-[#232834] hover:border-neutral-500 text-neutral-300 transition-all font-mono"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              লাইভ সাইট
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-[8px] bg-red-950/30 border border-red-800 hover:bg-red-900/50 text-red-300 transition-all font-mono"
            >
              <LogOut className="w-3.5 h-3.5" />
              লগআউট
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#232834] gap-2 pb-px">
          <button
            onClick={() => setActiveTab("dates")}
            className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-t-[8px] transition-all flex items-center gap-2 ${
              activeTab === "dates"
                ? "bg-[#14171E] border-t border-x border-[#232834] text-white border-b-transparent"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4 text-[#D81F26]" />
            তারিখ ও স্লট নিয়ন্ত্রণ ({dates.length})
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-t-[8px] transition-all flex items-center gap-2 ${
              activeTab === "bookings"
                ? "bg-[#14171E] border-t border-x border-[#232834] text-white border-b-transparent"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4 text-[#D81F26]" />
            ক্লায়েন্ট বুকিং লেজার ({bookings.length})
          </button>
        </div>

        {/* TAB 1: DATE & SLOT MANAGER */}
        {activeTab === "dates" && (
          <div className="space-y-6">
            {/* Add Date Box */}
            <div className="border border-[#232834] rounded-[16px] bg-[#14171E] p-6 space-y-4">
              <div className="space-y-1 border-b border-[#232834] pb-3">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#D81F26]" />
                  নতুন প্রমোশন তারিখ উন্মুক্ত করুন (Open Available Date)
                </h2>
                <p className="text-xs text-neutral-400">
                  যে যে তারিখে আপনি প্রমোশন করতে পারবেন, সেগুলো এখানে যুক্ত করুন। সাধারণ ক্লায়েন্টরা শুধুমাত্র আপনার যোগ করা তারিখগুলো থেকেই স্লট বুক করতে পারবে।
                </p>
              </div>

              {dateActionMsg && (
                <div
                  className={`p-3 rounded-[8px] text-xs font-mono flex items-center gap-2 ${
                    dateActionMsg.startsWith("✓")
                      ? "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                      : "bg-red-950/40 border border-red-800 text-red-300"
                  }`}
                >
                  <span>{dateActionMsg}</span>
                </div>
              )}

              <form onSubmit={handleAddDate} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4">
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    প্রমোশনের তারিখ *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#D81F26]"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    নোট বা টুর্নামেন্ট বিবরণ (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={newDateNote}
                    onChange={(e) => setNewDateNote(e.target.value)}
                    placeholder="যেমন: উইকএন্ড মেগা টুর্নামেন্ট স্লট"
                    className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D81F26]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-[8px] bg-[#D81F26] hover:bg-[#B9151B] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    তারিখ যুক্ত করুন
                  </button>
                </div>
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
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                              সক্রিয় (Active)
                            </span>
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

        {/* TAB 2: BOOKINGS LEDGER */}
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
                  className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D81F26]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-neutral-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#D81F26]"
                >
                  <option value="all">সকল স্ট্যাটাস</option>
                  <option value="pending">পেন্ডিং (Pending)</option>
                  <option value="confirmed">নিশ্চিত (Confirmed)</option>
                  <option value="rejected">বাতিল (Rejected)</option>
                </select>

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
                              {b.status !== "confirmed" && (
                                <button
                                  onClick={() => handleStatusChange(b.orderId, "confirmed")}
                                  disabled={updatingOrderId === b.orderId}
                                  className="p-1.5 rounded-[6px] bg-emerald-950/40 border border-emerald-800 text-emerald-400 hover:bg-emerald-900/60 transition-all"
                                  title="পেমেন্ট অ্যাপ্রুভ করুন"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
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
                  className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D81F26]"
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
                  className="w-full bg-[#0C0E12] border border-[#232834] rounded-[8px] px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D81F26]"
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
                  className="px-5 py-2 rounded-[8px] bg-[#D81F26] hover:bg-[#B9151B] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  {updatingPassword ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
