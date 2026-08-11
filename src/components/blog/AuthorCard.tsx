import React from 'react'
import Link from 'next/link'
import { SafeImage } from '@/components/ui/SafeImage'
import { User, Calendar, Clock, BookOpen, Globe } from 'lucide-react'

export interface AuthorSocialLinks {
  twitter?: string
  linkedin?: string
  github?: string
  website?: string
  facebook?: string
}

export interface AuthorCardProps {
  id?: string
  name: string
  slug?: string | null
  image?: string | null
  designation?: string | null
  bio?: string | null
  socialLinks?: AuthorSocialLinks | null
  articleCount?: number
  lastUpdated?: string | Date | null
  readingTime?: string | null
  className?: string
  variant?: 'compact' | 'full'
}

export function AuthorCard({
  name,
  slug,
  image,
  designation = "Official Author",
  bio,
  socialLinks,
  articleCount,
  lastUpdated,
  readingTime,
  className = "",
  variant = "full"
}: AuthorCardProps) {
  const authorSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const authorProfileUrl = `/author/${authorSlug}`

  const defaultBio = "Stock247 market intelligence team brings deep expertise in stock technical analysis, options liquidity flows, algorithmic trading models, and arcade gaming mechanics to deliver accurate financial insights."

  return (
    <div className={`glass-card rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-6 sm:p-8 transition-all duration-300 hover:border-primary/40 shadow-lg ${className}`}>
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Author Avatar with Default Fallback */}
        <Link href={authorProfileUrl} className="group shrink-0 relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-muted border-2 border-primary/30 group-hover:border-primary transition-all duration-300 shadow-md relative">
            {image ? (
              <SafeImage
                src={image}
                alt={name}
                fallbackText={name}
                fill
                sizes="96px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center text-primary font-bold text-2xl">
                {name ? name.substring(0, 2).toUpperCase() : <User className="w-8 h-8 text-muted-foreground" />}
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
            PRO
          </div>
        </Link>

        {/* Author Details */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div>
              <h3 className="text-xl font-extrabold text-foreground group">
                <Link href={authorProfileUrl} className="hover:text-primary transition-colors">
                  {name}
                </Link>
              </h3>
              <p className="text-xs font-semibold text-primary/90 uppercase tracking-widest mt-0.5">
                {designation || "Content Creator & Gaming Analyst"}
              </p>
            </div>

            {/* Badges / Stats */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
              {articleCount !== undefined && (
                <span className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full border border-border/40">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  <span>{articleCount} {articleCount === 1 ? 'Article' : 'Articles'}</span>
                </span>
              )}
              {readingTime && (
                <span className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full border border-border/40">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{readingTime}</span>
                </span>
              )}
            </div>
          </div>

          {/* Short Bio */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {bio || defaultBio}
          </p>

          {/* Social Links & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40 text-xs">
            <div className="flex items-center gap-3">
              {socialLinks?.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-full hover:bg-muted"
                  title="Twitter / X"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-muted"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
              )}
              {socialLinks?.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-muted"
                  title="GitHub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                  </svg>
                </a>
              )}
              {socialLinks?.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-emerald-400 transition-colors p-1.5 rounded-full hover:bg-muted"
                  title="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-4 ml-auto">
              {lastUpdated && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Updated {new Date(lastUpdated).toLocaleDateString()}</span>
                </span>
              )}
              <Link
                href={authorProfileUrl}
                className="font-bold text-primary hover:underline flex items-center gap-1 group/link"
              >
                Full Bio <span className="group-hover/link:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
