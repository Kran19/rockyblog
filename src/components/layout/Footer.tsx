import Link from "next/link";
import { TrendingUp, ShieldCheck, Zap } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-emerald-500/20 bg-slate-950/80 mt-20 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <span className="font-black text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-300">
                STOCK<span className="text-emerald-400">247</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Stock247 is your elite source for real-time market insights, stock trading strategies, algorithmic analysis, and high-speed gaming arcade mechanics. Trade smarter 24/7.
            </p>
            <div className="flex items-center space-x-4 text-xs text-emerald-400/80">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Telemetry</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Real-Time Signals</span>
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-white text-sm uppercase tracking-wider">Market Intelligence</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/blog" className="hover:text-emerald-400 transition-colors duration-300">Market Insights</Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-emerald-400 transition-colors duration-300">Categories</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors duration-300">About Stock247</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-white text-sm uppercase tracking-wider">Legal & Integrity</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors duration-300">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors duration-300">Terms of Service</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors duration-300">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} Stock247 (stock-247.com). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Next.js &amp; Stock247 Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

