"use client"

import { useEffect, useRef } from "react"

export interface UseBlogTrackerProps {
  postId?: string
  slug?: string
  userId?: string
}

function parseBrowserAndOS() {
  if (typeof window === "undefined") return { browser: "Unknown", os: "Unknown", device: "Desktop" }

  const ua = navigator.userAgent
  let browser = "Unknown Browser"
  let os = "Unknown OS"
  let device = "Desktop"

  // OS Detection
  if (ua.includes("Win")) os = "Windows"
  else if (ua.includes("Mac")) os = "macOS"
  else if (ua.includes("Linux")) os = "Linux"
  else if (ua.includes("Android")) os = "Android"
  else if (ua.includes("like Mac")) os = "iOS"

  // Browser Detection
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome"
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari"
  else if (ua.includes("Firefox")) browser = "Firefox"
  else if (ua.includes("Edg")) browser = "Edge"

  // Device Detection
  if (/Mobi|Android|iPhone/i.test(ua)) device = "Mobile"
  else if (/iPad|Tablet/i.test(ua)) device = "Tablet"

  return { browser, os, device }
}

function getOrSetStorage(key: string, prefix: string) {
  if (typeof window === "undefined") return ""
  let val = localStorage.getItem(key)
  if (!val) {
    val = `${prefix}_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`
    localStorage.setItem(key, val)
  }
  return val
}

export function useBlogTracker({ postId, slug, userId }: UseBlogTrackerProps) {
  const isTracked = useRef(false)

  useEffect(() => {
    if (isTracked.current || typeof window === "undefined" || (!postId && !slug)) return
    isTracked.current = true

    const visitorId = getOrSetStorage("nextblog_visitor_id", "vis")
    let sessionId = sessionStorage.getItem("nextblog_session_id")
    if (!sessionId) {
      sessionId = `sess_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`
      sessionStorage.setItem("nextblog_session_id", sessionId)
    }

    const { browser, os, device } = parseBrowserAndOS()
    const screenResolution = `${window.screen.width}x${window.screen.height}`
    const language = navigator.language || "en-US"
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Fire visitor tracking
    fetch("/api/blog/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        slug,
        visitorId,
        sessionId,
        browser,
        os,
        device,
        screenResolution,
        language,
        timezone,
        userAgent: navigator.userAgent,
        referrer: document.referrer || "Direct",
        landingPage: window.location.pathname,
        userId: userId || null,
      }),
    }).catch((err) => console.error("Visit tracker error:", err))
  }, [postId, slug, userId])

  const trackAndRedirect = async (ctaButton = "Primary CTA", fallbackUrl?: string) => {
    if (typeof window === "undefined") return

    const visitorId = getOrSetStorage("nextblog_visitor_id", "vis")
    const sessionId = sessionStorage.getItem("nextblog_session_id") || "sess_default"
    const { browser, os, device } = parseBrowserAndOS()

    // Extract UTM Parameters from URL
    const searchParams = new URLSearchParams(window.location.search)
    const utmSource = searchParams.get("utm_source") || undefined
    const utmMedium = searchParams.get("utm_medium") || undefined
    const utmCampaign = searchParams.get("utm_campaign") || undefined
    const utmTerm = searchParams.get("utm_term") || undefined
    const utmContent = searchParams.get("utm_content") || undefined

    try {
      const res = await fetch("/api/blog/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          slug,
          ctaButton,
          clickedUrl: window.location.href,
          visitorId,
          sessionId,
          browser,
          os,
          device,
          userAgent: navigator.userAgent,
          referrer: document.referrer || "Direct",
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          userId: userId || null,
        }),
      })

      const data = await res.json()

      // IF redirect_enabled == TRUE in DB
      if (data.shouldRedirect && data.redirectUrl) {
        window.location.href = data.redirectUrl
        return
      }

      // IF redirect_enabled == FALSE in DB
      if (fallbackUrl) {
        window.location.href = fallbackUrl
      }
    } catch (err) {
      console.error("Track click error:", err)
      if (fallbackUrl) {
        window.location.href = fallbackUrl
      }
    }
  }

  const trackAction = async (ctaButton = "Primary CTA", clickedUrl?: string) => {
    if (typeof window === "undefined") return

    const visitorId = getOrSetStorage("nextblog_visitor_id", "vis")
    const sessionId = sessionStorage.getItem("nextblog_session_id") || "sess_default"
    const { browser, os, device } = parseBrowserAndOS()

    const searchParams = new URLSearchParams(window.location.search)
    const utmSource = searchParams.get("utm_source") || undefined
    const utmMedium = searchParams.get("utm_medium") || undefined
    const utmCampaign = searchParams.get("utm_campaign") || undefined
    const utmTerm = searchParams.get("utm_term") || undefined
    const utmContent = searchParams.get("utm_content") || undefined

    try {
      await fetch("/api/blog/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          slug,
          ctaButton,
          clickedUrl: clickedUrl || window.location.href,
          visitorId,
          sessionId,
          browser,
          os,
          device,
          userAgent: navigator.userAgent,
          referrer: document.referrer || "Direct",
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          userId: userId || null,
          noRedirect: true,
        }),
      })
    } catch (err) {
      console.error("Track action error:", err)
    }
  }

  return { trackAndRedirect, trackAction }
}

