"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SafeImage } from "@/components/ui/SafeImage"
import { PlayNowBanner } from "@/components/blog/PlayNowBanner"
import { useBlogTracker } from "@/hooks/useBlogTracker"
import {
  Calendar,
  Clock,
  Share2,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Copy,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  ThumbsUp,
  MessageSquare,
  Globe,
} from "lucide-react"

interface ClothingBrandsContentProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    featuredImage: string | null
    createdAt: Date
    playImage?: string | null
    redirectUrl?: string | null
    author: {
      name: string | null
      image: string | null
      designation?: string | null
      bio?: string | null
    }
  }
}

export function ClothingBrandsContent({ post }: ClothingBrandsContentProps) {
  const { trackAndRedirect } = useBlogTracker({ postId: post.id, slug: post.slug })
  const [copied, setCopied] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const tableOfContents = [
    { id: "introduction", title: "1. Introduction to Global Clothing Brands" },
    { id: "luxury-fashion", title: "2. The Iconic Luxury Houses of 2026" },
    { id: "sustainable-brands", title: "3. Sustainable & Eco-Conscious Clothing Brands" },
    { id: "streetwear-trends", title: "4. Urban Streetwear & Casualwear Collectives" },
    { id: "fast-fashion", title: "5. Fast Fashion vs. Quality Investment Pieces" },
    { id: "fabric-guide", title: "6. Fabric Guide: Silk, Cashmere, Linen & Organic Cotton" },
    { id: "styling-tips", title: "7. Capsule Wardrobe Essentials & Styling Tips" },
    { id: "faq", title: "8. Frequently Asked Questions (FAQ)" },
  ]

  const faqs = [
    {
      question: "Which clothing brand is considered the most sustainable in 2026?",
      answer:
        "Patagonia, Reformation, and Stella McCartney remain global leaders in sustainable fashion. They utilize recycled fabrics, fair-trade certified organic cotton, and zero-waste production initiatives.",
    },
    {
      question: "How do I build a capsule wardrobe with premium clothing brands?",
      answer:
        "Focus on versatile neutrals: classic white tailored shirts, premium denim, cashmere crewnecks, structured blazers, and durable outerwear from timeless heritage brands.",
    },
    {
      question: "What is the difference between haute couture and high-end streetwear?",
      answer:
        "Haute couture involves custom-made, hand-crafted luxury pieces made to measure, whereas high-end streetwear blends casual everyday silhouettes (hoodies, sneakers, joggers) with luxury branding and limited-edition drops.",
    },
    {
      question: "How can I verify if a fashion brand is ethically certified?",
      answer:
        "Look for third-party certifications such as GOTS (Global Organic Textile Standard), B-Corp Certification, Fair Trade Certified, and Bluesign approved manufacturing processes.",
    },
  ]

  return (
    <article className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="max-w-5xl mx-auto mb-8 flex items-center text-xs font-medium text-slate-400 space-x-2">
        <Link href="/" className="hover:text-emerald-400 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-emerald-400 transition-colors">
          Fashion
        </Link>
        <span>/</span>
        <span className="text-emerald-400 truncate">{post.title}</span>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Definitive 2026 Style Guide</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
          {post.excerpt ||
            "Discover the ultimate master guide to global clothing brands, sustainable luxury fashion, streetwear innovations, and timeless wardrobe essentials for 2026."}
        </p>

        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-800 text-sm text-slate-400">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Featured Editorial Analysis</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>15 Min Read</span>
            </span>
          </div>
        </div>
      </header>

      {/* Featured Banner */}
      <div className="max-w-5xl mx-auto mb-12 relative h-[380px] sm:h-[500px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <Image
          src={post.featuredImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200"}
          alt={post.title}
          fill
          priority
          className="object-cover hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      </div>

      {/* Primary CTA Banner (Top) */}
      <div className="max-w-5xl mx-auto mb-10">
        <PlayNowBanner
          postId={post.id}
          slug={post.slug}
          title={post.title}
          image={post.playImage || post.featuredImage}
          redirectUrl={post.redirectUrl}
        />
      </div>

      {/* Grid Content Layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content Body */}
        <main className="lg:col-span-8 space-y-12 text-slate-300 leading-relaxed text-lg">
          {/* Table of Contents */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Tag className="w-5 h-5 text-emerald-400" />
              <span>Table of Contents</span>
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              {tableOfContents.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-slate-300 hover:text-emerald-400 transition-colors block">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 1 */}
          <section id="introduction" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-3">
              1. Introduction to Global Clothing Brands
            </h2>
            <p>
              The global fashion and clothing brand landscape in 2026 is defined by unprecedented innovation, sustainable textile development,
              and a seamless fusion between high-end luxury fashion and urban street culture. Modern consumers no longer shop solely for visual aesthetic;
              they demand ethical transparency, longevity, exceptional craftsmanship, and distinctive personal branding.
            </p>
            <p>
              Whether you arecurating a timeless capsule wardrobe or investing in statement runway pieces, understanding the brand hierarchy, fabric quality,
              and market position of major global clothing brands is vital. This comprehensive guide navigates through iconic luxury houses, pioneering sustainable
              collectives, and essential streetwear labels dominating 2026.
            </p>
          </section>

          {/* Section 2 */}
          <section id="luxury-fashion" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-3">
              2. The Iconic Luxury Houses of 2026
            </h2>
            <p>
              Luxury clothing brands represent the pinnacle of sartorial mastery. Modern heritage fashion houses continue to set global trends through impeccably engineered tailoring,
              rare textile sourcing, and legendary runway presentations.
            </p>
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xl font-semibold text-emerald-400">Key Luxury Brand Characteristics:</h4>
              <ul className="space-y-2 text-slate-300 text-base">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Artisanal craftsmanship with meticulous hand-stitching and bespoke tailoring.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Exclusive textile sourcing including Mulberry silk, Loro Piana cashmere, and Egyptian Giza cotton.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Strong resale value retained through limited production runs and timeless heritage designs.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Mid-Content CTA Button */}
          <div className="my-10 p-6 rounded-xl bg-slate-900 border border-emerald-500/40 text-center space-y-4 shadow-lg">
            <h3 className="text-xl font-bold text-white">Looking for Top Fashion Discounts & Exclusive Deals?</h3>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Check out our verified partner portal for current seasonal promotions on premium apparel and footwear.
            </p>
            <button
              onClick={() => trackAndRedirect("Mid-Content CTA Button")}
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-md transition-all"
            >
              <span>Shop Exclusive Offers</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Section 3 */}
          <section id="sustainable-brands" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-3">
              3. Sustainable & Eco-Conscious Clothing Brands
            </h2>
            <p>
              Eco-conscious fashion has evolved from a niche preference into an industry standard. Pioneering sustainable clothing brands in 2026 employ circular manufacturing,
              closed-loop water recycling, organic plant-based dyes, and fair-trade labor certification.
            </p>
            <p>
              Brands prioritizing longevity and repair programs—such as lifetime garment guarantees—allow consumers to reduce carbon footprints while maintaining peak sartorial elegance.
            </p>
          </section>

          {/* Section 4 */}
          <section id="streetwear-trends" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-3">
              4. Urban Streetwear & Casualwear Collectives
            </h2>
            <p>
              Streetwear remains the most dynamic sub-segment in the apparel market. Combining athletic comfort, oversized boxy silhouettes, heavyweight French terry cotton, and bold graphic work, streetwear brands bridge the gap between youth subcultures and mainstream haute couture.
            </p>
          </section>

          {/* Section 5 */}
          <section id="fast-fashion" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-3">
              5. Fast Fashion vs. Quality Investment Pieces
            </h2>
            <p>
              While fast fashion offers budget accessibility for micro-trends, investing in higher-grade clothing brands yields significantly better cost-per-wear value. High-density stitching, reinforced seams, and colorfast natural fibers retain shape and luster through hundreds of wash cycles.
            </p>
          </section>

          {/* Section 6 */}
          <section id="fabric-guide" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-3">
              6. Fabric Guide: Silk, Cashmere, Linen & Organic Cotton
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="font-bold text-emerald-400 text-lg mb-1">Grade-A Cashmere</h4>
                <p className="text-sm text-slate-300">Unmatched thermal insulation with lightweight softness sourced from Mongolian goats.</p>
              </div>
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="font-bold text-emerald-400 text-lg mb-1">Organic GOTS Cotton</h4>
                <p className="text-sm text-slate-300">Breathable, hypoallergenic staple cotton grown without synthetic pesticides or fertilizers.</p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="styling-tips" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-3">
              7. Capsule Wardrobe Essentials & Styling Tips
            </h2>
            <p>
              A capsule wardrobe consists of 15 to 20 interchangeable garments that can be combined effortlessly into over 50 distinct outfits. Key items include a structured dark wool overcoat, a crisp white button-down shirt, tailored chinos, raw selvedge denim, and minimal leather sneakers.
            </p>
          </section>

          {/* Section 8: FAQ */}
          <section id="faq" className="space-y-6 pt-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-3">
              8. Frequently Asked Questions (FAQ)
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full p-5 text-left font-bold text-lg text-white flex items-center justify-between hover:text-emerald-400 transition-colors"
                  >
                    <h3 className="text-lg font-bold text-white leading-snug">{faq.question}</h3>
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${activeFaq === index ? "rotate-180 text-emerald-400" : ""}`} />
                  </button>
                  {activeFaq === index && (
                    <div className="px-5 pb-5 text-slate-300 text-base border-t border-slate-800/60 pt-4 leading-relaxed">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA Banner (Bottom) */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-2xl space-y-4 text-center">
            <h3 className="text-3xl font-extrabold">Ready to Upgrade Your Style in 2026?</h3>
            <p className="text-emerald-100 text-base max-w-xl mx-auto">
              Explore featured clothing collections, luxury lookbooks, and current brand showcases today.
            </p>
            <button
              onClick={() => trackAndRedirect("Bottom Callout CTA Button")}
              className="inline-flex items-center space-x-2 px-9 py-4 bg-slate-950 hover:bg-slate-900 text-emerald-400 font-extrabold rounded-xl shadow-xl transition-all text-lg group"
            >
              <span>Visit Official Store</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Social Share Box */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-base flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Share Article</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`, "_blank")}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4 text-sky-400 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>X / Twitter</span>
              </button>
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`, "_blank")}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
              <button
                onClick={() => window.open(`https://www.linkedin.com/shareArticle?title=${encodeURIComponent(post.title)}`, "_blank")}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4 text-sky-600 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center space-x-2 transition-colors"
              >
                <Copy className="w-4 h-4 text-emerald-400" />
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          {/* Sticky Sidebar CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-emerald-950/60 border border-emerald-500/30 space-y-4 text-center sticky top-24 shadow-xl">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-xl font-bold text-white">Recommended Store</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore verified clothing brands and official partner storefronts with global shipping.
            </p>
            <button
              onClick={() => trackAndRedirect("Sidebar Sticky CTA")}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2"
            >
              <span>Explore Partner Site</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </aside>
      </div>
    </article>
  )
}
