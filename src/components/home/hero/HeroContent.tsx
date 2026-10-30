"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrendingUp, Zap, ShieldCheck, ArrowRight } from "lucide-react"

export function HeroContent() {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center max-w-4xl space-y-6"
      >
        <span className="inline-flex items-center space-x-2 border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md px-5 py-2 rounded-full text-xs font-extrabold tracking-[0.2em] text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)] uppercase">
          <Zap className="w-4 h-4 fill-current text-emerald-400" />
          <span>ALGORITHMIC SIGNALS &amp; MARKET TELEMETRY</span>
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] text-white tracking-tight">
          <span className="block">DOMINATE MARKETS.</span>
          <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(16,185,129,0.6)]">
            STOCK247 PRO.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 font-medium max-w-2xl leading-relaxed">
          Access real-time stock market telemetry, options flow analysis, algorithmic trading signals, and high-speed arcade crash mechanics 24/7.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400 pt-2">
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>99.4% Signal Accuracy</span>
          </span>
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Provably Fair Multipliers</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
          <Button 
            size="lg" 
            asChild
            className="w-full sm:w-auto rounded-2xl h-14 px-8 text-base font-black bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 group"
          >
            <a href="https://rocky11.club/?refercode=SEO&register" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2">
              <span>EXPLORE MARKET SIGNALS</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            asChild
            className="w-full sm:w-auto rounded-2xl h-14 px-8 text-base font-bold border-emerald-500/30 text-white hover:bg-emerald-500/10 hover:text-emerald-400 backdrop-blur-md transition-all duration-300"
          >
            <Link href="/blog">
              VIEW LIVE CHARTS
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

