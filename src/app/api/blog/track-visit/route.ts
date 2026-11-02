import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { detectGeoLocation } from "@/lib/geo"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      postId,
      visitorId,
      sessionId,
      browser,
      os,
      device,
      screenResolution,
      language,
      timezone,
      country: clientCountry,
      userAgent,
      referrer,
      landingPage,
      userId,
    } = body

    if (!postId || !visitorId || !sessionId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // IP Extraction
    const forwarded = req.headers.get("x-forwarded-for")
    const realIp = req.headers.get("x-real-ip")
    const ipAddress = forwarded ? forwarded.split(",")[0].trim() : realIp || "127.0.0.1"

    // Dynamic Geolocation Detection (Client -> CDN Headers -> Timezone -> IP lookup)
    const geo = await detectGeoLocation({
      headers: req.headers,
      ipAddress,
      clientCountry,
      timezone,
      language,
    })

    const country = geo.country
    const state = geo.state
    const city = geo.city

    // Check if returning visitor
    const previousVisit = await prisma.blogVisitor.findFirst({
      where: { postId, visitorId },
    })

    const isUnique = !previousVisit
    const isReturning = !!previousVisit

    // Insert visitor record
    const visitorRecord = await prisma.blogVisitor.create({
      data: {
        postId,
        visitorId,
        sessionId,
        ipAddress,
        country,
        state,
        city,
        browser: browser || "Unknown Browser",
        os: os || "Unknown OS",
        device: device || "Desktop",
        screenResolution,
        language: language || "en-US",
        timezone,
        userAgent,
        referrer,
        landingPage: landingPage || `/blog/${postId}`,
        isUnique,
        isReturning,
        userId: userId || null,
      },
    })

    // Upsert session record
    await prisma.blogSession.upsert({
      where: { sessionId },
      create: {
        sessionId,
        visitorId,
        startTime: new Date(),
        landingPage: landingPage || `/blog/${postId}`,
      },
      update: {
        endTime: new Date(),
      },
    })

    // Increment post view count
    await prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json({ success: true, visitorId: visitorRecord.id })
  } catch (error: any) {
    console.error("Track visit error:", error)
    return NextResponse.json({ error: error.message || "Failed to log visit" }, { status: 500 })
  }
}
