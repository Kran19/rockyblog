"use client"

import React from "react"
import { TrendingUp, TrendingDown, Zap, ShieldCheck } from "lucide-react"

interface TickerItem {
  symbol: string
  price: string
  change: string
  isPositive: boolean
  tag?: string
}

const TICKER_DATA: TickerItem[] = [
  { symbol: "NVDA", price: "$138.40", change: "+5.8%", isPositive: true },
  { symbol: "AAPL", price: "$235.10", change: "+2.4%", isPositive: true },
  { symbol: "BTC/USD", price: "$94,820", change: "+4.1%", isPositive: true, tag: "CRYPTO" },
  { symbol: "SPY 500", price: "$582.60", change: "+1.3%", isPositive: true },
  { symbol: "AVIATOR SIGNAL", price: "100x TARGET", change: "+99.4%", isPositive: true, tag: "PROVABLY FAIR" },
  { symbol: "TSLA", price: "$218.90", change: "-0.8%", isPositive: false },
  { symbol: "NIFTY 50", price: "24,950", change: "+1.8%", isPositive: true },
  { symbol: "CHICKEN CROSSY", price: "50x MULTIPLIER", change: "+88.5%", isPositive: true, tag: "HOT" },
  { symbol: "ETH/USD", price: "$3,450", change: "+3.6%", isPositive: true },
  { symbol: "OPTIONS CALL 585", price: "STRIKE WIN", change: "+320%", isPositive: true, tag: "SIGNAL" },
]

export function TradingTickerBar() {
  // Duplicate for seamless infinite loop
  const displayItems = [...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA]

  return (
    <div className="w-full bg-slate-950/90 border-y border-emerald-500/20 py-2.5 overflow-hidden relative z-20 backdrop-blur-md">
      <div className="flex w-max animate-[ticker_35s_linear_infinite] hover:[animation-play-state:paused]">
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center space-x-3 px-6 text-xs font-semibold shrink-0 border-r border-slate-800/80"
          >
            {item.tag && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                {item.tag}
              </span>
            )}
            <span className="text-slate-200 font-bold tracking-tight">{item.symbol}</span>
            <span className="text-slate-400">{item.price}</span>
            <span
              className={`inline-flex items-center space-x-0.5 font-extrabold ${
                item.isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {item.isPositive ? (
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-400" />
              )}
              <span>{item.change}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
