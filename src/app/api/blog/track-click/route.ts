import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { detectGeoLocation } from "@/lib/geo"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      postId,
      slug,
      ctaButton,
      clickedUrl,
      visitorId,
      sessionId,
      browser,
      os,
      device,
      userAgent,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      userId,
      noRedirect,
      country: clientCountry,
      timezone,
      language,
    } = body

    // Find the target post by ID or by Slug
    const post = await prisma.post.findFirst({
      where: postId ? { id: postId } : slug ? { slug } : undefined,
      select: {
        id: true,
        title: true,
        redirectEnabled: true,
        redirectUrl: true,
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
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

    // Log Click in BlogClick table
    await prisma.blogClick.create({
      data: {
        postId: post.id,
        blogTitle: post.title,
        clickedUrl: clickedUrl || post.redirectUrl || "Primary CTA",
        ipAddress,
        country,
        state,
        city,
        browser: browser || "Unknown Browser",
        os: os || "Unknown OS",
        device: device || "Desktop",
        userAgent,
        referrer,
        sessionId,
        visitorId,
        userId: userId || null,
        ctaButton: ctaButton || "Primary CTA",
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
      },
    })

    // Check dynamic redirect state directly from DB
    if (!noRedirect && post.redirectEnabled && post.redirectUrl) {
      const targetRedirectUrl =
        post.redirectUrl === "https://rocky11.club/?refercode=SEO"
          ? "https://rocky11.club/?refercode=SEO&register"
          : post.redirectUrl

      // Log in BlogRedirectLog
      await prisma.blogRedirectLog.create({
        data: {
          postId: post.id,
          clickedUrl: clickedUrl || "Primary CTA",
          redirectedTo: targetRedirectUrl,
          isSuccessful: true,
          ipAddress,
          userAgent,
        },
      })

      return NextResponse.json({
        shouldRedirect: true,
        redirectUrl: targetRedirectUrl,
      })
    }

    return NextResponse.json({
      shouldRedirect: false,
      redirectUrl: null,
    })
  } catch (error: any) {
    console.error("Track click error:", error)
    return NextResponse.json({ error: error.message || "Failed to log click" }, { status: 500 })
  }
}
