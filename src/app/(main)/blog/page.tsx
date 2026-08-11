import React from 'react';
import { prisma } from '@/lib/prisma';
import { PostCardItem } from '@/components/blog/PostCardItem';

export const dynamic = "force-dynamic";
export const revalidate = 60; // ISR
export const metadata = {
  title: 'Market Insights - Stock247',
  description: 'Read our latest stock market telemetry, options trading analysis, and market signals.',
  alternates: {
    canonical: '/blog',
  },
};

export default async function BlogPage() {
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: { categories: true },
    });
  } catch (e) {
    console.warn("Database unreachable during build time for blog page.", e);
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/20 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/20 blur-[150px] rounded-full -z-10" />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Market Insights &amp; Signals
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dive into institutional stock analysis, options order flow breakdowns, and provably fair multiplier guides.
          </p>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl bg-background/60">
            <p className="text-2xl text-muted-foreground font-semibold">
              Content is coming soon! Check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <PostCardItem key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
