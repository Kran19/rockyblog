"use client"

import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"

import { GradientBackground } from "./GradientBackground"
import { FloatingParticles } from "./FloatingParticles"
import { TradingTickerBar } from "./TradingTickerBar"
import { HeroContent } from "./HeroContent"
import { InteractiveCandleChart } from "./InteractiveCandleChart"

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen overflow-hidden bg-[#06080D] flex flex-col justify-between"
    >
      {/* Top Scrolling Financial Ticker */}
      <TradingTickerBar />

      <GradientBackground />
      <FloatingParticles />
      
      {/* Hero Central Content */}
      <HeroContent />

      {/* Interactive Candlestick Chart Preview */}
      <div className="px-4 pb-16 z-20">
        <InteractiveCandleChart />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-30 pointer-events-none" />
    </section>
  )
}

