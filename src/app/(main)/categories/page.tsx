import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FolderHeart } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Categories | Stock247',
  description: 'Browse stock market analysis, options strategies, and crypto signals by category.',
  alternates: {
    canonical: '/categories',
  },
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { posts: true }
      }
    }
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 min-h-[calc(100vh-16rem)]">
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Category</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
          Dive deep into specific gaming niches. Select a category below to see all related drops.
        </p>

        {categories.length === 0 ? (
          <div className="text-center p-12 border border-border/50 rounded-2xl bg-muted/20">
            <p className="text-lg text-muted-foreground">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat: any) => (
              <Link href={`/categories/${cat.slug}`} key={cat.id} className="group">
                <div className="p-8 h-full rounded-2xl border border-border/50 bg-card hover:bg-muted/50 hover:border-primary/50 transition-all duration-300 transform perspective-1000 hover:rotate-y-2 hover:-translate-y-2 shadow-sm hover:shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {cat.name}
                      </h2>
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {cat.description || `Explore posts about ${cat.name}.`}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FolderHeart className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between text-sm font-medium relative z-10">
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {cat._count.posts} {cat._count.posts === 1 ? 'Post' : 'Posts'}
                    </span>
                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                      View all →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
