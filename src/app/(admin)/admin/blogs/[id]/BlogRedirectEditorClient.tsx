"use client"

import React, { useState } from "react"
import { updateBlogRedirectAction } from "@/actions/blog.actions"
import { ShieldCheck, Lock, ExternalLink, Save, CheckCircle, AlertCircle } from "lucide-react"

interface BlogRedirectEditorClientProps {
  post: {
    id: string
    title: string
    slug: string
    redirectEnabled: boolean
    redirectUrl: string | null
    redirectDelay?: number
    metaPixelId?: string | null
  }
  userRole: string
}

export function BlogRedirectEditorClient({ post, userRole }: BlogRedirectEditorClientProps) {
  const [redirectEnabled, setRedirectEnabled] = useState(post.redirectEnabled)
  const [redirectUrl, setRedirectUrl] = useState(post.redirectUrl || "https://rocky11.club/?refercode=SEO&register")
  const [redirectDelay, setRedirectDelay] = useState(post.redirectDelay ?? 3)
  const [metaPixelId, setMetaPixelId] = useState(post.metaPixelId || "1826423055376624")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const isSuperAdmin = userRole === "ADMIN"

  const handleSaveRedirect = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSuperAdmin) return

    setSaving(true)
    setMessage(null)

    try {
      await updateBlogRedirectAction({
        postId: post.id,
        redirectEnabled,
        redirectUrl,
        redirectDelay,
        metaPixelId,
      })
      setMessage({ type: "success", text: "Redirect and Meta Pixel settings updated successfully!" })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update redirect settings" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Dynamic Redirect & Meta Pixel Configuration</h3>
            <p className="text-xs text-slate-400">Super Admin control panel for CTA redirect destination and Facebook Meta Pixel ID.</p>
          </div>
        </div>

        {!isSuperAdmin && (
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Super Admin Only</span>
          </span>
        )}
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
            message.type === "success" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
          }`}
        >
          {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSaveRedirect} className="space-y-6">
        {/* Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <label className="text-sm font-bold text-white block">Redirect Status (ON / OFF)</label>
            <p className="text-xs text-slate-400 mt-0.5">
              When ON, clicking primary CTA buttons or viewing the blog initiates timed redirect.
            </p>
          </div>

          <button
            type="button"
            disabled={!isSuperAdmin}
            onClick={() => setRedirectEnabled(!redirectEnabled)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
              redirectEnabled ? "bg-emerald-500" : "bg-slate-700"
            } ${!isSuperAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                redirectEnabled ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Destination URL & Delay */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Destination Redirect URL</label>
            <div className="relative">
              <input
                type="url"
                disabled={!isSuperAdmin}
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="https://rocky11.club/?refercode=SEO&register"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 disabled:opacity-50 font-mono"
              />
              <ExternalLink className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Redirect Delay (Seconds)</label>
            <input
              type="number"
              min={1}
              max={60}
              disabled={!isSuperAdmin}
              value={redirectDelay}
              onChange={(e) => setRedirectDelay(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50 font-mono"
            />
          </div>
        </div>

        {/* Meta Pixel Field */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Meta (Facebook) Pixel ID (Post-Wise / Default)</label>
          <p className="text-xs text-slate-400">
            Set custom Facebook Pixel ID for this blog post, or keep default (<code className="text-emerald-400">1826423055376624</code>).
          </p>
          <input
            type="text"
            disabled={!isSuperAdmin}
            value={metaPixelId}
            onChange={(e) => setMetaPixelId(e.target.value)}
            placeholder="1826423055376624"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 disabled:opacity-50 font-mono"
          />
        </div>

        {isSuperAdmin && (
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Redirect Settings..." : "Save Redirect Settings"}</span>
          </button>
        )}
      </form>
    </div>
  )
}
