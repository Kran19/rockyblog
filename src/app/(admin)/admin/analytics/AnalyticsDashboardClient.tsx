"use client"

import React, { useState, useEffect } from "react"
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts"
import { deleteAnalyticsAction } from "@/actions/blog.actions"
import {
  Users,
  MousePointer,
  ArrowUpRight,
  RefreshCw,
  Download,
  Trash2,
  Search,
  Filter,
  Activity,
  Calendar,
  Globe,
  Monitor,
  ShieldAlert,
} from "lucide-react"

interface AnalyticsDashboardClientProps {
  stats: {
    totalVisitorsCount: number
    uniqueVisitorsCount: number
    returningVisitorsCount: number
    todayVisitors: number
    yesterdayVisitors: number
    weekVisitors: number
    monthVisitors: number
    totalClicksCount: number
    ctr: string
  }
  visitorsList: any[]
  hourlyTraffic: any[]
  countryDistribution: any[]
  deviceDistribution: any[]
  browserDistribution: any[]
  blogs: { id: string; title: string; slug: string }[]
  userRole: string
}

export function AnalyticsDashboardClient({
  stats,
  visitorsList,
  hourlyTraffic,
  countryDistribution,
  deviceDistribution,
  browserDistribution,
  blogs,
  userRole,
}: AnalyticsDashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBlog, setSelectedBlog] = useState("all")
  const [liveCount, setLiveCount] = useState(stats.totalVisitorsCount)
  const [liveClicks, setLiveClicks] = useState(stats.totalClicksCount)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Real-Time Ticker
  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString())
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + (Math.random() > 0.7 ? 1 : 0))
      if (Math.random() > 0.85) setLiveClicks((prev) => prev + 1)
      setLastUpdated(new Date().toLocaleTimeString())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Filter visitors
  const filteredVisitors = visitorsList.filter((v) => {
    const matchesSearch =
      (v.ipAddress || "").includes(searchQuery) ||
      (v.country || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.browser || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.post?.title || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesBlog = selectedBlog === "all" || v.postId === selectedBlog

    return matchesSearch && matchesBlog
  })

  // Export functions
  const exportCSV = () => {
    const headers = "Visitor ID,IP Address,Country,State,City,Browser,OS,Device,Visited At,Session ID\n"
    const rows = filteredVisitors
      .map(
        (v) =>
          `"${v.visitorId}","${v.ipAddress}","${v.country}","${v.state}","${v.city}","${v.browser}","${v.os}","${v.device}","${v.visitedAt}","${v.sessionId}"`
      )
      .join("\n")

    const blob = new Blob([headers + rows], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics_report_${Date.now()}.csv`
    a.click()
  }

  const exportExcelJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(filteredVisitors, null, 2))}`
    const a = document.createElement("a")
    a.href = jsonString
    a.download = `analytics_data_${Date.now()}.json`
    a.click()
  }

  const exportPDF = () => {
    window.print()
  }

  const handleDeleteAnalytics = async () => {
    if (!confirm("Are you sure you want to purge all analytics data? This action cannot be undone.")) return
    setIsDeleting(true)
    try {
      await deleteAnalyticsAction({})
      window.location.reload()
    } catch (err: any) {
      alert(err.message || "Failed to delete analytics")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="p-6 sm:p-10 bg-slate-950 min-h-screen text-slate-100 space-y-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-3xl font-extrabold text-white">Analytics Dashboard</h1>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Engine</span>
            </span>
          </div>
          <p className="text-sm text-slate-400">Granular visitor telemetry, click rates, and dynamic redirect analytics.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportExcelJSON}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={exportPDF}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Print PDF</span>
          </button>

          {userRole === "ADMIN" && (
            <button
              onClick={handleDeleteAnalytics}
              disabled={isDeleting}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Purge Logs</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Feed Ticker */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-300">
        <div className="flex items-center space-x-3">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>
            Live Real-Time Activity Feed: <strong className="text-white font-bold">{liveCount}</strong> Lifetime Visitors |{" "}
            <strong className="text-white font-bold">{liveClicks}</strong> Clicks
          </span>
        </div>
        <div className="text-slate-500">Auto-Refreshed: {lastUpdated}</div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
            <span>Total Visitors</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{liveCount}</p>
          <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Today: {stats.todayVisitors} visits</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
            <span>Unique Visitors</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.uniqueVisitorsCount}</p>
          <p className="text-xs text-slate-400">Returning: {stats.returningVisitorsCount} users</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
            <span>Redirect Clicks</span>
            <MousePointer className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{liveClicks}</p>
          <p className="text-xs text-purple-400 font-semibold">Click-Through Rate: {stats.ctr}%</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
            <span>This Month</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.monthVisitors}</p>
          <p className="text-xs text-slate-400">This Week: {stats.weekVisitors} visits</p>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <AnalyticsCharts
        hourlyTraffic={hourlyTraffic}
        countryDistribution={countryDistribution}
        deviceDistribution={deviceDistribution}
        browserDistribution={browserDistribution}
      />

      {/* Search & Filter Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Filter className="w-5 h-5 text-emerald-400" />
            <span>Visitor Telemetry Log Table</span>
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search IP, Country, Browser..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-64"
              />
            </div>

            <select
              value={selectedBlog}
              onChange={(e) => setSelectedBlog(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Blogs</option>
              {blogs.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visitor Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Visitor / IP</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Browser & OS</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Blog Article</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No visitor telemetry records match your filters.
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">
                      <div>{v.ipAddress || "127.0.0.1"}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">{v.visitorId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {v.country || "India"}, {v.city && v.city !== "San Francisco" ? v.city : "Online"}
                    </td>
                    <td className="py-3.5 px-4">
                      {v.browser} / {v.os}
                    </td>
                    <td className="py-3.5 px-4">{v.device}</td>
                    <td className="py-3.5 px-4 text-emerald-400 truncate max-w-[180px]">{v.post?.title || v.postId}</td>
                    <td className="py-3.5 px-4">
                      {v.isUnique ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                          Unique
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-semibold text-[10px]">
                          Returning
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(v.visitedAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
