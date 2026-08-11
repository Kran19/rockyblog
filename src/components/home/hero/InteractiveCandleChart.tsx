"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, ArrowUpRight, ShieldCheck, Zap, BarChart3, Lock } from "lucide-react"

export function InteractiveCandleChart() {
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => (prev + 1) % 100)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Simulated Candlesticks Data
  const candles = [
    { height: "h-16", color: "bg-emerald-500", wickHigh: "h-24", wickLow: "h-20", isGreen: true },
    { height: "h-10", color: "bg-rose-500", wickHigh: "h-14", wickLow: "h-12", isGreen: false },
    { height: "h-20", color: "bg-emerald-500", wickHigh: "h-28", wickLow: "h-22", isGreen: true },
    { height: "h-14", color: "bg-emerald-400", wickHigh: "h-20", wickLow: "h-16", isGreen: true },
    { height: "h-8", color: "bg-rose-500", wickHigh: "h-12", wickLow: "h-10", isGreen: false },
    { height: "h-24", color: "bg-emerald-400", wickHigh: "h-32", wickLow: "h-26", isGreen: true },
    { height: "h-18", color: "bg-emerald-500", wickHigh: "h-24", wickLow: "h-20", isGreen: true },
    { height: "h-28", color: "bg-teal-400", wickHigh: "h-36", wickLow: "h-30", isGreen: true },
  ]

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl bg-slate-950/90 border border-emerald-500/30 p-6 sm:p-8 shadow-[0_20px_50px_rgba(16,185,129,0.2)] backdrop-blur-xl overflow-hidden group">
      {/* Background Holographic Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40 pointer-events-none" />

      {/* Radiant Background Glows */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Stat Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black text-white tracking-wide">STOCK247 / MARKET TELEMETRY</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-xs text-slate-400 font-semibold">Live Algorithmic Flow &amp; Signal Matrix</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 font-extrabold flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>ACCURACY 99.4%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-extrabold flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>PROVABLY FAIR</span>
          </div>
        </div>
      </div>

      {/* Candlestick Visualization Area */}
      <div className="relative z-10 my-8 h-48 sm:h-56 flex items-end justify-between px-4 sm:px-12 border-b border-slate-800/80 pb-2">
        {/* Dynamic Horizontal Laser Line */}
        <div className="absolute top-1/3 left-0 w-full border-t border-dashed border-emerald-500/40 flex justify-between items-center px-4 text-[10px] font-mono text-emerald-400">
          <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-emerald-500/40">BREAKOUT TARGET $585.00</span>
          <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded animate-pulse">+320.5%</span>
        </div>

        {candles.map((candle, index) => (
          <div key={index} className="relative flex flex-col items-center justify-end group/candle cursor-pointer">
            {/* Candle Wick */}
            <div className={`w-0.5 ${candle.wickHigh} ${candle.color} opacity-60 absolute bottom-0`} />

            {/* Candle Body */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`w-6 sm:w-10 ${candle.height} ${candle.color} rounded-sm relative z-10 shadow-lg group-hover/candle:brightness-125 transition-all`}
            />

            {/* Hover Tooltip */}
            <div className="absolute -top-12 opacity-0 group-hover/candle:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded border border-emerald-500/40 whitespace-nowrap shadow-xl z-30 pointer-events-none">
              VOL: $14.2M | +{(index + 1) * 1.5}%
            </div>
          </div>
        ))}
      </div>

      {/* Footer Metrics Row */}
      <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 gap-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 font-mono text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>BULLISH MOMENTUM ACTIVE</span>
          </span>
        </div>
        <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-500">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-BIT ENCRYPTED TELEMETRY STREAM</span>
        </div>
      </div>
    </div>
  )
}
