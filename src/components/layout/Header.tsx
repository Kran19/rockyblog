"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap } from "lucide-react";

export function Header() {
  const pathname = usePathname() || "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-500/20 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 md:gap-10 items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="font-black text-2xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                STOCK<span className="text-emerald-400">247</span>
              </span>
              <span className="ml-1 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/blog"
              className={`flex items-center text-sm font-medium transition-colors hover:text-emerald-400 ${pathname.startsWith("/blog") ? "text-emerald-400 font-bold" : "text-muted-foreground"}`}
            >
              Market Insights
            </Link>
            <Link
              href="/categories"
              className={`flex items-center text-sm font-medium transition-colors hover:text-emerald-400 ${pathname.startsWith("/categories") ? "text-emerald-400 font-bold" : "text-muted-foreground"}`}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className={`flex items-center text-sm font-medium transition-colors hover:text-emerald-400 ${pathname === "/about" ? "text-emerald-400 font-bold" : "text-muted-foreground"}`}
            >
              About Us
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-3">
            <Button 
              asChild
              className="font-black bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 border-0 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-300 rounded-xl px-5"
            >
              <a href="https://rocky11.club/?refercode=SEO" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 fill-current" />
                <span>TRADE NOW</span>
              </a>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}

