"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useBlogTracker } from "@/hooks/useBlogTracker"
import { Play, X, ArrowRight } from "lucide-react"

interface FullScreenBlogPopupProps {
  postId: string
  slug: string
  title: string
  image?: string | null
  redirectUrl?: string | null
}

export function FullScreenBlogPopup({
  postId,
  slug,
  title,
  redirectUrl,
}: FullScreenBlogPopupProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { trackAndRedirect, trackAction } = useBlogTracker({ postId, slug })

  const TARGET_URL = "https://rocky11.club/?refercode=SEO&register"
  const destinationUrl =
    !redirectUrl || redirectUrl === "https://rocky11.club/?refercode=SEO"
      ? TARGET_URL
      : redirectUrl

  const handleClose = useCallback(() => {
    setIsOpen(false)
    if (typeof document !== "undefined") {
      document.body.style.overflow = "unset"
    }
  }, [])

  const handlePlayNow = (ctaType = "Popup CTA: PLAY NOW Button") => {
    handleClose()
    trackAndRedirect(ctaType, destinationUrl)
  }

  const handleDismiss = useCallback(
    (reason = "Popup Action: Dismissed (Close Button)") => {
      handleClose()
      trackAction(reason, typeof window !== "undefined" ? window.location.href : undefined)
    },
    [handleClose, trackAction]
  )

  // Prevent background scroll while popup is open & listen for Escape key
  useEffect(() => {
    setMounted(true)
    if (isOpen && typeof document !== "undefined") {
      document.body.style.overflow = "hidden"
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss("Popup Action: Dismissed (Escape Key)")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (typeof document !== "undefined") {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen, handleDismiss])

  if (!mounted || !isOpen) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="RockyBook Play Announcement"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => {
        // Close if backdrop directly clicked
        if (e.target === e.currentTarget) {
          handleDismiss("Popup Action: Dismissed (Backdrop Click)")
        }
      }}
    >
      {/* Dynamic Ambient Glow Behind Modal */}
      <div className="absolute w-[300px] sm:w-[550px] h-[300px] sm:h-[550px] bg-amber-500/20 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] bg-emerald-500/15 blur-[130px] rounded-full pointer-events-none -z-10 translate-x-24 translate-y-20" />

      {/* Main Responsive Pop-Up Modal Card */}
      <div
        className="w-full max-w-[360px] sm:max-w-[460px] md:max-w-xl lg:max-w-3xl max-h-[94dvh] sm:max-h-[92vh] bg-gradient-to-b from-slate-950 via-black to-slate-950 border border-amber-400/40 rounded-3xl shadow-[0_0_60px_rgba(234,179,8,0.35)] relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 text-white group cursor-pointer"
        onClick={() => handlePlayNow("Popup CTA: Popup Card Click")}
      >
        {/* Close Icon Button (Prominent & Mobile Touch Friendly) */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDismiss("Popup Action: Dismissed (Close Button)")
          }}
          type="button"
          aria-label="Close pop-up"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/85 hover:bg-black/95 border border-white/30 hover:border-amber-400 text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>

        {/* Scrollable Container (guarantees perfect display on any height/aspect device) */}
        <div className="overflow-y-auto overflow-x-hidden flex flex-col">
          {/* Laptop and Large Devices Image (>= 1024px / lg) */}
          <div
            onClick={(e) => {
              e.stopPropagation()
              handlePlayNow("Popup CTA: Laptop Banner Image")
            }}
            className="hidden lg:block relative w-full overflow-hidden rounded-t-3xl cursor-pointer select-none bg-black"
          >
            <img
              src="/images/popup/Leptop.webp"
              alt={title || "RockyBook - Play More Win Bigger"}
              className="w-full h-auto max-h-[74vh] object-contain mx-auto transition-transform duration-500 hover:scale-[1.01]"
            />
          </div>

          {/* Small Mobile and Tablet Devices Image (< 1024px / lg) */}
          <div
            onClick={(e) => {
              e.stopPropagation()
              handlePlayNow("Popup CTA: Mobile Banner Image")
            }}
            className="block lg:hidden relative w-full overflow-hidden rounded-t-3xl cursor-pointer select-none bg-black"
          >
            <img
              src="/images/popup/Mobile.webp"
              alt={title || "RockyBook - Play More Win Bigger"}
              className="w-full h-auto max-h-[66vh] object-contain mx-auto transition-transform duration-500 hover:scale-[1.01]"
            />
          </div>

          {/* Action Bar with Bold "PLAY NOW" Button and Exit Option */}
          <div className="p-3.5 sm:p-5 pt-2 sm:pt-3 space-y-2.5 text-center flex flex-col items-center bg-gradient-to-t from-black via-slate-950 to-slate-950/90 border-t border-amber-400/20">
            {/* Bold Golden "PLAY NOW" Action Button */}
            <div className="w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlayNow("Popup CTA: PLAY NOW Button")
                }}
                type="button"
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-lg sm:text-xl tracking-wider uppercase shadow-[0_0_35px_rgba(234,179,8,0.55)] hover:shadow-[0_0_50px_rgba(234,179,8,0.85)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
              >
                <span>PLAY NOW</span>
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Dismiss link / Continue to article */}
            <div className="pt-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDismiss("Popup Action: Dismissed (Continue Reading)")
                }}
                type="button"
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline-offset-4 hover:underline cursor-pointer flex items-center space-x-1"
              >
                <span>Continue reading article</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
