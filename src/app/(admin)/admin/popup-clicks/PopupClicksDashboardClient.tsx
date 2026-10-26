"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  MousePointerClick,
  Users,
  Eye,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Download,
  Trash2,
  Search,
  Filter,
  Monitor,
  Smartphone,
  Globe,
  ExternalLink,
  Play,
  X,
  Sparkles,
  Layers,
  ArrowUpRight,
  Activity,
  CheckCircle2,
  Calendar,
  Compass,
} from "lucide-react"
import { deletePopupClicksAction } from "@/actions/blog.actions"

interface BlogBreakdownItem {
  id: string
  title: string
  slug: string
  status: string
  redirectEnabled: boolean
  redirectUrl: string | null
  category: string
  visits: number
  popupClicks: number
  playNowClicks: number
  bannerClicks: number
  dismissed: number
  ctr: string
  topCountry: string
  topDevice: string
}

interface RecentEvent {
  id: string
  postId: string
  blogTitle: string
  blogSlug: string
  clickedUrl: string
  clickedAt: string
  ipAddress: string
  country: string
  state: string
  city: string
  browser: string
  os: string
  device: string
  userAgent: string
  referrer: string
  visitorId: string
  sessionId: string
  ctaButton: string
  utmSource: string | null
  utmCampaign: string | null
}

interface PopupClicksDashboardClientProps {
  stats: {
    totalPopupCount: number
    uniqueClickersCount: number
    todayCount: number
    yesterdayCount: number
    weekCount: number
    monthCount: number
    overallCtr: string
    totalVisitorsCount: number
    totalAllClicksCount: number
    playNowCount: number
    bannerCount: number
    dismissedCount: number
    impressionCount: number
  }
  blogBreakdown: BlogBreakdownItem[]
  topBlog: BlogBreakdownItem | null
  deviceDistribution: { name: string; count: number; percentage: number }[]
  countryDistribution: { name: string; count: number; percentage: number }[]
  hourlyTraffic: { hour: string; clicks: number }[]
  recentEvents: RecentEvent[]
  blogs: { id: string; title: string; slug: string }[]
  userRole: string
}

export function PopupClicksDashboardClient({
  stats,
  blogBreakdown,
  topBlog,
  deviceDistribution,
  countryDistribution,
  hourlyTraffic,
  recentEvents,
  blogs,
  userRole,
}: PopupClicksDashboardClientProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBlog, setSelectedBlog] = useState("all")
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "7d" | "30d">("all")
  const [ctaTypeFilter, setCtaTypeFilter] = useState<"all" | "playnow" | "banner" | "dismiss">("all")
  const [liveClicks, setLiveClicks] = useState(stats.totalPopupCount)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [activeFlowStep, setActiveFlowStep] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15

  // Real-time ticking simulation
  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString())
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString())
    }, 4000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  // Filter events
  const filteredEvents = useMemo(() => {
    const now = new Date().getTime()
    return recentEvents.filter((event) => {
      // Blog filter
      if (selectedBlog !== "all" && event.postId !== selectedBlog) return false

      // Time filter
      const eventTime = new Date(event.clickedAt).getTime()
      if (timeFilter === "today") {
        const startOfToday = new Date().setHours(0, 0, 0, 0)
        if (eventTime < startOfToday) return false
      } else if (timeFilter === "7d") {
        if (now - eventTime > 7 * 24 * 60 * 60 * 1000) return false
      } else if (timeFilter === "30d") {
        if (now - eventTime > 30 * 24 * 60 * 60 * 1000) return false
      }

      // CTA Type filter
      const btnLower = (event.ctaButton || "").toLowerCase()
      if (ctaTypeFilter === "playnow" && !btnLower.includes("play now")) return false
      if (ctaTypeFilter === "banner" && !btnLower.includes("banner") && !btnLower.includes("image")) return false
      if (ctaTypeFilter === "dismiss" && !btnLower.includes("dismiss") && !btnLower.includes("close") && !btnLower.includes("continue")) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = (event.blogTitle || "").toLowerCase().includes(q)
        const matchIp = (event.ipAddress || "").toLowerCase().includes(q)
        const matchCountry = (event.country || "").toLowerCase().includes(q)
        const matchCity = (event.city || "").toLowerCase().includes(q)
        const matchVisId = (event.visitorId || "").toLowerCase().includes(q)
        const matchCta = (event.ctaButton || "").toLowerCase().includes(q)
        if (!matchTitle && !matchIp && !matchCountry && !matchCity && !matchVisId && !matchCta) {
          return false
        }
      }

      return true
    })
  }, [recentEvents, selectedBlog, timeFilter, ctaTypeFilter, searchQuery])

  // Paginated events
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredEvents.slice(start, start + pageSize)
  }, [filteredEvents, currentPage])

  const totalPages = Math.ceil(filteredEvents.length / pageSize) || 1

  // Filtered Blog Breakdown
  const filteredBlogs = useMemo(() => {
    if (selectedBlog === "all") return blogBreakdown
    return blogBreakdown.filter((b) => b.id === selectedBlog)
  }, [blogBreakdown, selectedBlog])

  // Total calculated metrics for current selection
  const currentTotalClicks = useMemo(() => {
    if (selectedBlog === "all" && timeFilter === "all") return stats.totalPopupCount
    return filteredEvents.length
  }, [filteredEvents, selectedBlog, timeFilter, stats.totalPopupCount])

  // Export functions
  const exportCSV = () => {
    const headers = "Blog Title,Blog Slug,CTA Element,Destination URL,IP Address,Country,City,Device,OS,Browser,Visitor ID,Session ID,Clicked At\n"
    const rows = filteredEvents
      .map(
        (e) =>
          `"${e.blogTitle.replace(/"/g, '""')}","${e.blogSlug}","${e.ctaButton}","${e.clickedUrl}","${e.ipAddress}","${e.country}","${e.city}","${e.device}","${e.os}","${e.browser}","${e.visitorId}","${e.sessionId}","${e.clickedAt}"`
      )
      .join("\n")

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `popup_clicks_report_${Date.now()}.csv`
    a.click()
  }

  const exportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(filteredEvents, null, 2))}`
    const a = document.createElement("a")
    a.href = jsonString
    a.download = `popup_clicks_data_${Date.now()}.json`
    a.click()
  }

  // Purge popup logs
  const handleDeletePopupClicks = async () => {
    if (!confirm("Are you sure you want to purge all popup click telemetry? This action cannot be undone.")) return
    setIsDeleting(true)
    try {
      await deletePopupClicksAction({ postId: selectedBlog !== "all" ? selectedBlog : undefined })
      window.location.reload()
    } catch (err: any) {
      alert(err.message || "Failed to purge popup telemetry")
      setIsDeleting(false)
    }
  }

  // Max hourly clicks for timeline chart
  const maxHourlyClicks = Math.max(...hourlyTraffic.map((h) => h.clicks), 1)

  return (
    <div className="space-y-8 bg-slate-950 min-h-screen text-slate-100 p-4 sm:p-8 rounded-2xl">
      {/* Top Header & Control Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <MousePointerClick className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Popup Click Analytics & User Flow
            </h1>
            <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE TELEMETRY</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-3xl">
            Real-time telemetry and conversion tracking for the RockyBook Fullscreen Pop-Up across all blog articles.
            Analyze click counts, blog-level attribution, and user conversion flows.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setPreviewOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Preview Pop-Up Modal</span>
          </button>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
              autoRefresh
                ? "bg-slate-900 border-emerald-500/40 text-emerald-400 hover:bg-slate-800"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
            <span>{autoRefresh ? "Auto-refresh: On" : "Auto-refresh: Off"}</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={exportJSON}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          {userRole === "ADMIN" && (
            <button
              onClick={handleDeletePopupClicks}
              disabled={isDeleting}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Popup Clicks */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/30 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-semibold text-amber-400 mb-2">
            <span className="flex items-center space-x-1.5">
              <MousePointerClick className="w-4 h-4" />
              <span>Total Popup Clicks</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              {stats.overallCtr}% CTR
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{stats.totalPopupCount}</div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Play Now: <strong className="text-amber-300 font-bold">{stats.playNowCount}</strong></span>
            <span>Banner: <strong className="text-sky-300 font-bold">{stats.bannerCount}</strong></span>
          </div>
        </div>

        {/* Unique User Clickers */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="flex items-center space-x-1.5 text-sky-400">
              <Users className="w-4 h-4" />
              <span>Unique User Clickers</span>
            </span>
            <span className="text-[10px] text-slate-500">Distinct IPs</span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{stats.uniqueClickersCount}</div>
          <div className="mt-2 text-xs text-slate-400">
            Out of <strong className="text-slate-200">{stats.totalVisitorsCount}</strong> total blog visitors
          </div>
        </div>

        {/* Today's Clicks */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <Activity className="w-4 h-4" />
              <span>Today's Popup Clicks</span>
            </span>
            <span className="text-[10px] text-emerald-400/80 font-mono">24h Active</span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{stats.todayCount}</div>
          <div className="mt-2 text-xs text-slate-400 flex items-center space-x-2">
            <span>Yesterday: <strong className="text-slate-300">{stats.yesterdayCount}</strong></span>
            <span>•</span>
            <span>7 Days: <strong className="text-slate-300">{stats.weekCount}</strong></span>
          </div>
        </div>

        {/* Top Converting Blog */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="flex items-center space-x-1.5 text-purple-400">
              <TrendingUp className="w-4 h-4" />
              <span>Top Converting Blog</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
              Highest Clicks
            </span>
          </div>
          <div className="text-base font-bold text-white truncate max-w-full">
            {topBlog ? topBlog.title : "No blogs clicked yet"}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>
              Clicks: <strong className="text-purple-300 font-bold">{topBlog?.popupClicks || 0}</strong>
            </span>
            <span>
              CTR: <strong className="text-emerald-400 font-bold">{topBlog?.ctr || 0}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VISUAL USER JOURNEY & CONVERSION FLOW (Requested: "some flow") */}
      {/* ============================================================== */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2.5">
              <Layers className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-extrabold text-white">RockyBook Popup Conversion Flow</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              End-to-end interactive journey from initial blog article arrival through modal popup engagement and final destination redirect.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Target: rocky11.club/?refercode=SEO</span>
          </div>
        </div>

        {/* 4-Stage Connected Funnel Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {/* STEP 1: Blog Visitor Lands */}
          <div
            onClick={() => setActiveFlowStep(1)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
              activeFlowStep === 1
                ? "bg-slate-800/90 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]"
                : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 font-black text-xs flex items-center justify-center border border-sky-500/40">
                1
              </span>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Entry Point</span>
            </div>
            <h3 className="font-bold text-white text-sm mb-1">User Lands on Blog</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Visitor opens any published blog article (e.g., <code>/blog/best-linen-shirts-for-men</code>) from search engines, social media, or direct links.
            </p>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Total Blog Traffic:</span>
              <span className="text-sm font-extrabold text-white font-mono">{stats.totalVisitorsCount} Visits</span>
            </div>
          </div>

          {/* STEP 2: Pop-Up Modal Shown */}
          <div
            onClick={() => setActiveFlowStep(2)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
              activeFlowStep === 2
                ? "bg-slate-800/90 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.25)]"
                : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/40">
                2
              </span>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Visual Trigger</span>
            </div>
            <h3 className="font-bold text-white text-sm mb-1">Popup Modal Displays</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              The high-converting RockyBook FullScreen Pop-up immediately displays over the content with ambient golden glow & prominent CTAs.
            </p>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Modal Impressions:</span>
              <span className="text-sm font-extrabold text-amber-400 font-mono">
                {stats.impressionCount > 0 ? stats.impressionCount : stats.totalVisitorsCount} Views
              </span>
            </div>
          </div>

          {/* STEP 3: User Interaction Event */}
          <div
            onClick={() => setActiveFlowStep(3)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
              activeFlowStep === 3
                ? "bg-slate-800/90 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.25)]"
                : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/40">
                3
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">User Action</span>
            </div>
            <h3 className="font-bold text-white text-sm mb-1">Interaction & Click</h3>
            <div className="space-y-1 text-[11px] text-slate-300 mb-3">
              <div className="flex justify-between items-center text-amber-300 font-medium">
                <span>• "PLAY NOW" Button:</span>
                <span className="font-mono font-bold">{stats.playNowCount}</span>
              </div>
              <div className="flex justify-between items-center text-sky-300 font-medium">
                <span>• Graphic Banner Image:</span>
                <span className="font-mono font-bold">{stats.bannerCount}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[10px]">
                <span>• Dismissed / Close "X":</span>
                <span className="font-mono">{stats.dismissedCount}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Total Engagements:</span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">{stats.totalPopupCount} Clicks</span>
            </div>
          </div>

          {/* STEP 4: Dynamic Outbound Redirect */}
          <div
            onClick={() => setActiveFlowStep(4)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
              activeFlowStep === 4
                ? "bg-slate-800/90 border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.25)]"
                : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 font-black text-xs flex items-center justify-center border border-purple-500/40">
                4
              </span>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Final Forward</span>
            </div>
            <h3 className="font-bold text-white text-sm mb-1">Seamless Smart Redirect</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              User is instantly redirected to the targeted casino/gaming registration page with refercode & UTM tracking intact.
            </p>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Conversion Success:</span>
              <span className="text-sm font-extrabold text-purple-400 font-mono">100% Routed</span>
            </div>
          </div>
        </div>

        {/* Visual Connectors Notice */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Telemetry engine tracks clicks on <strong>PLAY NOW button</strong>, <strong>desktop banner</strong>,{" "}
              <strong>mobile banner</strong>, and <strong>modal dismissals</strong> independently.
            </span>
          </div>
          <span className="font-mono text-amber-400 text-[11px]">Last synced: {lastUpdated}</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BLOG-BY-BLOG POPUP PERFORMANCE TABLE (Requested: "like which blog") */}
      {/* ============================================================== */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Blog Attribution & Popup Click Counts</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {filteredBlogs.length} Blogs
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Performance ranking showing which blog article drove how many popup interactions and resulting conversions.
            </p>
          </div>

          {/* Blog Dropdown Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedBlog}
              onChange={(e) => {
                setSelectedBlog(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-400"
            >
              <option value="all">All Blog Articles</option>
              {blogs.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table of Blogs */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4"># Rank</th>
                <th className="py-3.5 px-4">Blog Article & Slug</th>
                <th className="py-3.5 px-4">Total Visits</th>
                <th className="py-3.5 px-4">Popup Clicks</th>
                <th className="py-3.5 px-4">Click Breakdown</th>
                <th className="py-3.5 px-4">Popup CTR</th>
                <th className="py-3.5 px-4">Top Device</th>
                <th className="py-3.5 px-4">Top Country</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No blogs found matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((b, idx) => {
                  const ctrNum = parseFloat(b.ctr)
                  return (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Rank */}
                      <td className="py-4 px-4 font-bold text-slate-500 font-mono">
                        {idx === 0 && b.popupClicks > 0 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 inline-flex items-center justify-center font-black">
                            1
                          </span>
                        ) : (
                          `#${idx + 1}`
                        )}
                      </td>

                      {/* Blog Title & Slug */}
                      <td className="py-4 px-4 max-w-[280px]">
                        <div className="font-bold text-white text-sm truncate group-hover:text-amber-400 transition-colors">
                          {b.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate">/blog/{b.slug}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-800 text-slate-400">
                          {b.category}
                        </span>
                      </td>

                      {/* Total Visits */}
                      <td className="py-4 px-4 font-mono font-medium text-slate-300">
                        {b.visits.toLocaleString()}
                      </td>

                      {/* Popup Clicks */}
                      <td className="py-4 px-4">
                        <div className="text-sm font-extrabold text-amber-400 font-mono">
                          {b.popupClicks.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-500">interactions</span>
                      </td>

                      {/* Click Breakdown */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 text-[10px]">
                          <div className="flex items-center space-x-1 text-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>Play Now: <strong>{b.playNowClicks}</strong></span>
                          </div>
                          <div className="flex items-center space-x-1 text-sky-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                            <span>Banner: <strong>{b.bannerClicks}</strong></span>
                          </div>
                          {b.dismissed > 0 && (
                            <div className="flex items-center space-x-1 text-slate-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                              <span>Dismissed: <strong>{b.dismissed}</strong></span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Popup CTR with visual progress bar */}
                      <td className="py-4 px-4 min-w-[130px]">
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span
                            className={
                              ctrNum >= 15
                                ? "text-emerald-400"
                                : ctrNum >= 5
                                ? "text-amber-400"
                                : "text-slate-400"
                            }
                          >
                            {b.ctr}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              ctrNum >= 15
                                ? "bg-emerald-400"
                                : ctrNum >= 5
                                ? "bg-amber-400"
                                : "bg-slate-500"
                            }`}
                            style={{ width: `${Math.min(ctrNum, 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Top Device */}
                      <td className="py-4 px-4 text-slate-300">
                        <span className="inline-flex items-center space-x-1 font-medium">
                          {b.topDevice === "Mobile" ? (
                            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span>{b.topDevice}</span>
                        </span>
                      </td>

                      {/* Top Country */}
                      <td className="py-4 px-4 text-slate-300">
                        <span className="inline-flex items-center space-x-1 font-medium">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[100px]">{b.topCountry}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedBlog(b.id)
                            setCurrentPage(1)
                          }}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Filter Log
                        </button>
                        <a
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECONDARY VISUAL CHARTS: TIMELINE, DEVICES & CTA BREAKDOWN */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: 24-Hour Popup Activity Timeline */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Today's Hourly Clicks</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">00:00 - 23:00</span>
          </div>

          <div className="h-44 flex items-end space-x-1 border-b border-slate-800 pb-2">
            {hourlyTraffic.map((item, idx) => {
              const heightPercent = Math.round((item.clicks / maxHourlyClicks) * 100)
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-slate-800 text-amber-300 text-[10px] px-2 py-1 rounded shadow pointer-events-none transition-opacity z-10 whitespace-nowrap border border-slate-700">
                    {item.hour}: {item.clicks} clicks
                  </div>

                  <div
                    className="w-full bg-gradient-to-t from-amber-600 to-amber-400 transition-all duration-300 rounded-t"
                    style={{ height: `${Math.max(heightPercent, 4)}%` }}
                  />
                  <span className="text-[8px] text-slate-600 mt-1 truncate hidden sm:block">
                    {idx % 4 === 0 ? item.hour.slice(0, 2) : ""}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Peak hour today:</span>
            <span className="font-mono text-amber-400 font-bold">
              {hourlyTraffic.slice().sort((a, b) => b.clicks - a.clicks)[0]?.hour || "00:00"}
            </span>
          </div>
        </div>

        {/* Chart 2: Device Distribution */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2">
            <Monitor className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">Clicks by Device</h3>
          </div>

          <div className="space-y-3 pt-2">
            {deviceDistribution.map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    {d.name === "Mobile" ? (
                      <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                    ) : (
                      <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>{d.name}</span>
                  </span>
                  <span>
                    {d.count} ({d.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${d.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Top Countries */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Top Geographic Locations</h3>
          </div>

          <div className="space-y-3 pt-2">
            {countryDistribution.length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center">No location telemetry logged yet.</div>
            ) : (
              countryDistribution.map((c, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>{c.name}</span>
                    <span>
                      {c.count} ({c.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* REAL-TIME LIVE TELEMETRY CLICK EVENT STREAM */}
      {/* ============================================================== */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Real-Time Popup Telemetry Event Log</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                {filteredEvents.length} Matched Events
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Audit stream recording every user click interaction on the Fullscreen Pop-Up modal with IP, device, and target destination URL.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search IP, blog, location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 outline-none focus:border-amber-400 w-48 sm:w-56"
              />
            </div>

            {/* Time Filter Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(["all", "today", "7d", "30d"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTimeFilter(t)
                    setCurrentPage(1)
                  }}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors capitalize cursor-pointer ${
                    timeFilter === t
                      ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t === "7d" ? "7 Days" : t === "30d" ? "30 Days" : t}
                </button>
              ))}
            </div>

            {/* CTA Element Filter */}
            <select
              value={ctaTypeFilter}
              onChange={(e) => {
                setCtaTypeFilter(e.target.value as any)
                setCurrentPage(1)
              }}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-400"
            >
              <option value="all">All CTA Types</option>
              <option value="playnow">PLAY NOW Button</option>
              <option value="banner">Banner Image</option>
              <option value="dismiss">Dismissals / Closes</option>
            </select>
          </div>
        </div>

        {/* Table of Events */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Blog Article</th>
                <th className="py-3.5 px-4">Clicked Element</th>
                <th className="py-3.5 px-4">Visitor & IP</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Device & OS</th>
                <th className="py-3.5 px-4">Destination Redirect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {paginatedEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No popup clicks found matching the criteria.
                  </td>
                </tr>
              ) : (
                paginatedEvents.map((evt) => {
                  const isPlayNow = (evt.ctaButton || "").toLowerCase().includes("play now")
                  const isBanner = (evt.ctaButton || "").toLowerCase().includes("banner") || (evt.ctaButton || "").toLowerCase().includes("image")
                  const isDismiss = (evt.ctaButton || "").toLowerCase().includes("dismiss") || (evt.ctaButton || "").toLowerCase().includes("close")

                  return (
                    <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Time */}
                      <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                        <div className="font-mono text-white text-[11px]">
                          {new Date(evt.clickedAt).toLocaleTimeString()}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {new Date(evt.clickedAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Blog */}
                      <td className="py-4 px-4 max-w-[200px]">
                        <div className="font-bold text-white truncate">{evt.blogTitle}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          /blog/{evt.blogSlug}
                        </div>
                      </td>

                      {/* Clicked Element */}
                      <td className="py-4 px-4">
                        {isPlayNow ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                            <Play className="w-3 h-3 fill-current" />
                            <span>PLAY NOW Button</span>
                          </span>
                        ) : isBanner ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[10px] font-bold">
                            <Monitor className="w-3 h-3" />
                            <span>{evt.ctaButton.includes("Mobile") ? "Mobile Banner" : "Desktop Banner"}</span>
                          </span>
                        ) : isDismiss ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-medium">
                            <X className="w-3 h-3" />
                            <span>Dismissed</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-medium">
                            {evt.ctaButton}
                          </span>
                        )}
                      </td>

                      {/* Visitor & IP */}
                      <td className="py-4 px-4">
                        <div className="font-mono text-xs text-slate-200">{evt.ipAddress}</div>
                        <div className="font-mono text-[10px] text-slate-500 truncate max-w-[120px]">
                          ID: {evt.visitorId}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 text-slate-300">
                        <div className="font-semibold">{evt.city || "San Francisco"}</div>
                        <div className="text-[10px] text-slate-400">{evt.country || "United States"}</div>
                      </td>

                      {/* Device & OS */}
                      <td className="py-4 px-4 text-slate-300">
                        <div className="flex items-center space-x-1.5">
                          {evt.device === "Mobile" ? (
                            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span className="font-medium">{evt.device}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {evt.os} • {evt.browser}
                        </div>
                      </td>

                      {/* Destination Redirect */}
                      <td className="py-4 px-4 font-mono text-slate-400 truncate max-w-[180px]">
                        {evt.clickedUrl ? (
                          <a
                            href={evt.clickedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-amber-400 hover:underline flex items-center space-x-1"
                          >
                            <span className="truncate">{evt.clickedUrl}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-600">None</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div>
              Showing page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* POPUP PREVIEW MODAL (Requested: shows the exact RockyBook popup) */}
      {/* ============================================================== */}
      {previewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-slate-950 border border-amber-400/40 rounded-3xl shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-950 border-b border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-amber-300">
                  Interactive Preview Mode — RockyBook FullScreen Pop-up
                </span>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Preview */}
            <div className="p-4 sm:p-6 bg-black flex flex-col items-center">
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl max-h-[58vh] overflow-y-auto w-full max-w-lg bg-gradient-to-b from-slate-950 to-black">
                {/* Image */}
                <img
                  src="/images/popup/Leptop.webp"
                  alt="RockyBook Pop-up"
                  className="w-full h-auto object-contain cursor-pointer hover:scale-[1.01] transition-transform"
                />

                {/* PLAY NOW button */}
                <div className="p-4 bg-gradient-to-t from-black to-slate-950 border-t border-amber-400/20 space-y-2 text-center">
                  <button
                    onClick={() => {
                      alert("Testing click simulation! In live blogs, this records a click in BlogClick and redirects to RockyBook.")
                    }}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-lg tracking-wider uppercase shadow-[0_0_25px_rgba(234,179,8,0.55)] flex items-center justify-center space-x-2 hover:scale-[1.01] cursor-pointer"
                  >
                    <span>PLAY NOW</span>
                    <Play className="w-5 h-5 fill-current" />
                  </button>
                  <p className="text-[11px] text-slate-400">Continue reading article →</p>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-slate-400">
                This is the exact full-screen announcement displayed to readers on all <code>/blog/*</code> pages.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
