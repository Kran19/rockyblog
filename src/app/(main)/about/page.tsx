import React from 'react';
import { Target, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export const metadata = {
  title: 'About Stock247 - Real-Time Market Intelligence & Signals',
  description: 'Learn more about Stock247 and our mission for real-time market telemetry, options trading analysis, and strategic gaming mechanics.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
          Precision Trading & Market Signals
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
          We believe modern financial markets and high-speed arcade games require identical principles: data discipline, emotional control, and mathematical risk management.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <h2 className="text-3xl font-bold text-white">The Stock247 Edge</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            At Stock247 (stock-247.com), we view financial markets not as random noise, but as a complex ecosystem of liquidity flows, options gamma, and algorithmic trends. Successful traders don't rely on luck—they rely on data telemetry, strict stop-losses, and proven strategy execution.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Sustainable profitability is the byproduct of executing sound statistical edges consistently over time. We provide deep-dive market breakdowns, technical chart analysis, and crash-game multiplier guides to elevate your strategy.
          </p>
        </div>
        <div className="bg-slate-950/90 rounded-3xl p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-white">Precision Data</h3>
                <p className="text-muted-foreground">Every price level calculated. Every signal verified.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-white">Market Growth</h3>
                <p className="text-muted-foreground">Consistent, disciplined portfolio expansion.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-white">24/7 Execution</h3>
                <p className="text-muted-foreground">High-speed signals and provably fair multipliers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/80 rounded-3xl p-8 md:p-12 border border-emerald-500/20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold text-white">Disciplined Risk Management</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
          We champion strict risk management across stock trading and arcade gaming. Always risk capital you can afford to lose, define stop-loss parameters, and treat every position like a calculated business decision.
        </p>
      </div>
    </div>
  );
}

