import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Hero } from "@/components/home/hero/Hero"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { SafeImage } from "@/components/ui/SafeImage"
import { Gamepad2 } from 'lucide-react'
import { PostCardItem } from "@/components/blog/PostCardItem"


export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate page every 60 seconds (ISR)

export default async function Home() {
  let settings = null;
  let latestPosts: any[] = [];

  try {
    settings = await prisma.globalSettings.findUnique({
      where: { id: "global" }
    })
    
    latestPosts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        categories: true,
        author: true
      }
    })
  } catch (error) {
    console.warn("Database unreachable during build time. Falling back to empty state for prerendering.", error);
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section with 3D Cinematic Vibe */}
      <Hero />

      {/* Latest Posts Section */}
      <section className="py-24 bg-muted/30 border-t border-border/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Latest Drops</h2>
              <p className="text-muted-foreground text-lg">Fresh content straight from the servers.</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex" asChild>
              <Link href="/blog">View All Posts →</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post: any) => (
              <PostCardItem key={post.id} post={post} />
            ))}
          </div>
          
          <div className="mt-10 flex justify-center sm:hidden">
            <Button variant="outline" size="lg" className="w-full rounded-full" asChild>
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <a 
        href="https://rocky11.club/?refercode=SEO&register" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group flex flex-col items-center animate-[bounce_3s_infinite]"
      >
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#00D09C] to-[#00ffcc] shadow-[0_0_20px_rgba(0,208,156,0.5)] text-black mb-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,208,156,0.8)] overflow-hidden">
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-12" />
          <Gamepad2 className="w-8 h-8 z-10" />
        </div>
        <span className="bg-background/90 backdrop-blur-sm border border-border/50 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg text-foreground group-hover:text-[#00D09C] transition-colors whitespace-nowrap">
          Join our games
        </span>
      </a>
    </div>
  )
}
