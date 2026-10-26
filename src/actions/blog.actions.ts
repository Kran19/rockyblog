"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateBlogRedirectAction({
  postId,
  redirectEnabled,
  redirectUrl,
  redirectDelay = 3,
  metaPixelId,
}: {
  postId: string
  redirectEnabled: boolean
  redirectUrl: string | null
  redirectDelay?: number
  metaPixelId?: string | null
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only Super Admin can modify redirect settings.")
  }

  const sanitizedDelay = Math.max(1, Math.min(60, Number(redirectDelay) || 3))
  const sanitizedPixelId = metaPixelId?.trim() ? metaPixelId.trim() : null

  // Fetch current state for audit log
  const currentPost = await prisma.post.findUnique({
    where: { id: postId },
    select: { redirectEnabled: true, redirectUrl: true, redirectDelay: true, metaPixelId: true, title: true },
  })

  if (!currentPost) {
    throw new Error("Blog post not found.")
  }

  // Validate URL format if enabled
  if (redirectEnabled && redirectUrl) {
    try {
      new URL(redirectUrl)
    } catch {
      throw new Error("Invalid Destination URL format. Must be a valid HTTP/HTTPS URL.")
    }
  }

  // Update Post record
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      redirectEnabled,
      redirectUrl: redirectEnabled ? redirectUrl : null,
      redirectDelay: sanitizedDelay,
      metaPixelId: sanitizedPixelId,
    },
  })

  // Log in Audit Trail
  await prisma.blogAuditLog.create({
    data: {
      postId,
      action: "UPDATE_REDIRECT_SETTINGS",
      userId: session.user.id,
      userEmail: session.user.email || "admin@stock-247.com",
      oldValue: JSON.stringify({
        redirectEnabled: currentPost.redirectEnabled,
        redirectUrl: currentPost.redirectUrl,
        redirectDelay: currentPost.redirectDelay,
        metaPixelId: currentPost.metaPixelId,
      }),
      newValue: JSON.stringify({
        redirectEnabled,
        redirectUrl: redirectEnabled ? redirectUrl : null,
        redirectDelay: sanitizedDelay,
        metaPixelId: sanitizedPixelId,
      }),
    },
  })

  revalidatePath("/admin/blogs")
  revalidatePath(`/admin/blogs/${postId}`)
  revalidatePath("/admin/analytics")

  return { success: true, post: updatedPost }
}

export async function deleteAnalyticsAction({ postId }: { postId?: string }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only Super Admin can delete analytics data.")
  }

  if (postId) {
    await prisma.blogVisitor.deleteMany({ where: { postId } })
    await prisma.blogClick.deleteMany({ where: { postId } })
    await prisma.blogRedirectLog.deleteMany({ where: { postId } })
  } else {
    await prisma.blogVisitor.deleteMany()
    await prisma.blogClick.deleteMany()
    await prisma.blogRedirectLog.deleteMany()
  }

  await prisma.blogAuditLog.create({
    data: {
      postId: postId || null,
      action: "DELETE_ANALYTICS",
      userId: session.user.id,
      userEmail: session.user.email || "admin@stock-247.com",
      oldValue: "All visitor and click telemetry logs",
      newValue: "Purged",
    },
  })

  revalidatePath("/admin/analytics")
  return { success: true }
}

export async function deletePopupClicksAction({ postId }: { postId?: string }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only Super Admin can delete popup telemetry.")
  }

  const popupFilter = {
    OR: [
      { ctaButton: { contains: "Pop-Up", mode: "insensitive" as const } },
      { ctaButton: { contains: "Popup", mode: "insensitive" as const } },
    ],
  }

  if (postId) {
    await prisma.blogClick.deleteMany({
      where: {
        postId,
        ...popupFilter,
      },
    })
  } else {
    await prisma.blogClick.deleteMany({
      where: popupFilter,
    })
  }

  await prisma.blogAuditLog.create({
    data: {
      postId: postId || null,
      action: "DELETE_POPUP_CLICKS",
      userId: session.user.id,
      userEmail: session.user.email || "admin@stock-247.com",
      oldValue: "Popup click telemetry logs",
      newValue: "Purged",
    },
  })

  revalidatePath("/admin/popup-clicks")
  revalidatePath("/admin/analytics")
  return { success: true }
}
