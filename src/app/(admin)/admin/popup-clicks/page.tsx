import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PopupClicksDashboardClient } from "./PopupClicksDashboardClient"

export const dynamic = "force-dynamic"

export default async function PopupClicksPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/admin/login")
  }

  // Fetch all posts with their visitor & total click counts
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      redirectEnabled: true,
      redirectUrl: true,
      playImage: true,
      featuredImage: true,
      createdAt: true,
      categories: { select: { id: true, name: true, slug: true } },
      _count: {
        select: { visitors: true, clicks: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Query all BlogClicks that belong to the Fullscreen Pop-Up
  const popupClicks = await prisma.blogClick.findMany({
    where: {
      OR: [
        { ctaButton: { contains: "Pop-Up", mode: "insensitive" } },
        { ctaButton: { contains: "Popup", mode: "insensitive" } },
      ],
    },
    orderBy: { clickedAt: "desc" },
    include: {
      post: {
        select: { id: true, title: true, slug: true, redirectUrl: true },
      },
    },
  })

  // Date boundaries
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Overall totals
  const totalVisitorsCount = await prisma.blogVisitor.count()
  const uniqueVisitorsCount = await prisma.blogVisitor.count({ where: { isUnique: true } })
  const totalAllClicksCount = await prisma.blogClick.count()

  // Filter popup clicks by time
  const todayPopupClicks = popupClicks.filter((c) => new Date(c.clickedAt) >= startOfToday)
  const yesterdayPopupClicks = popupClicks.filter(
    (c) => new Date(c.clickedAt) >= startOfYesterday && new Date(c.clickedAt) < startOfToday
  )
  const weekPopupClicks = popupClicks.filter((c) => new Date(c.clickedAt) >= startOfWeek)
  const monthPopupClicks = popupClicks.filter((c) => new Date(c.clickedAt) >= startOfMonth)

  // Unique popup clickers by visitorId / ipAddress
  const uniqueClickerIds = new Set(
    popupClicks.map((c) => c.visitorId || c.ipAddress).filter(Boolean)
  )

  // Sub-breakdowns of popup interactions
  const playNowClicks = popupClicks.filter((c) => {
    const btn = (c.ctaButton || "").toLowerCase()
    return btn.includes("play now")
  })
  const bannerClicks = popupClicks.filter((c) => {
    const btn = (c.ctaButton || "").toLowerCase()
    return btn.includes("banner") || btn.includes("image")
  })
  const dismissedClicks = popupClicks.filter((c) => {
    const btn = (c.ctaButton || "").toLowerCase()
    return btn.includes("dismiss") || btn.includes("continue reading") || btn.includes("close")
  })
  const impressionClicks = popupClicks.filter((c) => {
    const btn = (c.ctaButton || "").toLowerCase()
    return btn.includes("impression") || btn.includes("displayed")
  })

  // Device Breakdown for popup clicks
  const deviceCounts: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0 }
  popupClicks.forEach((c) => {
    const dev = c.device || "Desktop"
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1
  })

  const totalPopupCount = popupClicks.length
  const deviceDistribution = Object.entries(deviceCounts).map(([name, count]) => ({
    name,
    count,
    percentage: totalPopupCount > 0 ? Math.round((count / totalPopupCount) * 100) : 0,
  }))

  // Hourly traffic for popup clicks today (00:00 - 23:00)
  const hourlyMap: Record<string, number> = {}
  for (let i = 0; i < 24; i++) {
    const hourLabel = `${i.toString().padStart(2, "0")}:00`
    hourlyMap[hourLabel] = 0
  }
  todayPopupClicks.forEach((c) => {
    const hour = new Date(c.clickedAt).getHours()
    const hourLabel = `${hour.toString().padStart(2, "0")}:00`
    hourlyMap[hourLabel] = (hourlyMap[hourLabel] || 0) + 1
  })
  const hourlyTraffic = Object.keys(hourlyMap).map((hour) => ({
    hour,
    clicks: hourlyMap[hour],
  }))

  // Country distribution for popup clicks
  const countryCounts: Record<string, number> = {}
  popupClicks.forEach((c) => {
    const ctry = c.country || "Unknown"
    countryCounts[ctry] = (countryCounts[ctry] || 0) + 1
  })
  const countryDistribution = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalPopupCount > 0 ? Math.round((count / totalPopupCount) * 100) : 0,
    }))

  // Blog-by-Blog Breakdown for Popup Performance
  const blogBreakdown = posts.map((post) => {
    const postPopupClicks = popupClicks.filter((c) => c.postId === post.id)
    const postPlayNowClicks = postPopupClicks.filter((c) =>
      (c.ctaButton || "").toLowerCase().includes("play now")
    ).length
    const postBannerClicks = postPopupClicks.filter((c) => {
      const btn = (c.ctaButton || "").toLowerCase()
      return btn.includes("banner") || btn.includes("image")
    }).length
    const postDismissed = postPopupClicks.filter((c) =>
      (c.ctaButton || "").toLowerCase().includes("dismiss")
    ).length

    const visits = post._count.visitors || 0
    const clicks = postPopupClicks.length
    const ctr = visits > 0 ? ((clicks / visits) * 100).toFixed(1) : "0.0"

    // Top country for this blog
    const bCountryMap: Record<string, number> = {}
    postPopupClicks.forEach((c) => {
      const country = c.country || "Unknown"
      bCountryMap[country] = (bCountryMap[country] || 0) + 1
    })
    const topCountry =
      Object.entries(bCountryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

    // Top device for this blog
    const bDeviceMap: Record<string, number> = {}
    postPopupClicks.forEach((c) => {
      const dev = c.device || "Desktop"
      bDeviceMap[dev] = (bDeviceMap[dev] || 0) + 1
    })
    const topDevice =
      Object.entries(bDeviceMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "Desktop"

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      status: post.status,
      redirectEnabled: post.redirectEnabled,
      redirectUrl: post.redirectUrl,
      category: post.categories?.[0]?.name || "General",
      visits,
      popupClicks: clicks,
      playNowClicks: postPlayNowClicks,
      bannerClicks: postBannerClicks,
      dismissed: postDismissed,
      ctr,
      topCountry,
      topDevice,
    }
  })

  // Sort blog breakdown by popup clicks descending
  blogBreakdown.sort((a, b) => b.popupClicks - a.popupClicks)

  // Overall Popup CTR (Popup Clicks / Total Visits)
  const overallCtr =
    totalVisitorsCount > 0
      ? ((totalPopupCount / totalVisitorsCount) * 100).toFixed(1)
      : "0.0"

  // Top performing blog
  const topBlog = blogBreakdown[0] || null

  // Serialize recent popup click events (take last 200)
  const recentEvents = popupClicks.slice(0, 200).map((c) => ({
    id: c.id,
    postId: c.postId,
    blogTitle: c.blogTitle || c.post?.title || "Blog Post",
    blogSlug: c.post?.slug || "",
    clickedUrl: c.clickedUrl,
    clickedAt: c.clickedAt.toISOString(),
    ipAddress: c.ipAddress || "127.0.0.1",
    country: c.country || "United States",
    state: c.state || "California",
    city: c.city || "San Francisco",
    browser: c.browser || "Chrome",
    os: c.os || "Windows",
    device: c.device || "Desktop",
    userAgent: c.userAgent || "",
    referrer: c.referrer || "Direct",
    visitorId: c.visitorId || "Unknown",
    sessionId: c.sessionId || "Unknown",
    ctaButton: c.ctaButton || "Popup CTA",
    utmSource: c.utmSource || null,
    utmCampaign: c.utmCampaign || null,
  }))

  return (
    <PopupClicksDashboardClient
      stats={{
        totalPopupCount,
        uniqueClickersCount: uniqueClickerIds.size,
        todayCount: todayPopupClicks.length,
        yesterdayCount: yesterdayPopupClicks.length,
        weekCount: weekPopupClicks.length,
        monthCount: monthPopupClicks.length,
        overallCtr,
        totalVisitorsCount,
        totalAllClicksCount,
        playNowCount: playNowClicks.length,
        bannerCount: bannerClicks.length,
        dismissedCount: dismissedClicks.length,
        impressionCount: impressionClicks.length,
      }}
      blogBreakdown={blogBreakdown}
      topBlog={topBlog}
      deviceDistribution={deviceDistribution}
      countryDistribution={countryDistribution}
      hourlyTraffic={hourlyTraffic}
      recentEvents={recentEvents}
      blogs={posts.map((p) => ({ id: p.id, title: p.title, slug: p.slug }))}
      userRole={session.user.role}
    />
  )
}
