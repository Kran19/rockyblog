import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ClothingBrandsContent } from "@/components/blog/ClothingBrandsContent"
import { TimedRedirectBanner } from "@/components/blog/TimedRedirectBanner"
import { PlayNowBanner } from "@/components/blog/PlayNowBanner"
import { FullScreenBlogPopup } from "@/components/blog/FullScreenBlogPopup"
import { FaqAccordion } from "@/components/blog/FaqAccordion"
import { SafeImage } from "@/components/ui/SafeImage"
import { MetaPixel } from "@/components/analytics/MetaPixel"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  let post: any = null
  try {
    post = await prisma.post.findUnique({
      where: { slug },
    })
    if (!post) {
      post = await prisma.post.findFirst({
        where: {
          OR: [
            { slug: { startsWith: slug } },
            { slug: { contains: slug } },
          ],
        },
      })
    }
  } catch (err) {
    console.warn("Database unreachable during metadata generation for blog page.", err)
  }

  if (!post) {
    return { title: "Stock Market Article | Stock247" }
  }

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || "Read our latest stock market and trading insights on Stock247."
  const canonicalUrl = `https://stock-247.com/blog/${post.slug}`
  const bannerImage = post.featuredImage || "https://stock-247.com/images/default-blog-banner.svg"

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [{ url: bannerImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [bannerImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function DynamicBlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  let post: any = null

  try {
    post = await prisma.post.findUnique({
      where: { slug },
      include: {
        categories: true,
      },
    })
    if (!post) {
      post = await prisma.post.findFirst({
        where: {
          OR: [
            { slug: { startsWith: slug } },
            { slug: { contains: slug } },
          ],
        },
        include: {
          categories: true,
        },
      })
    }
  } catch (err) {
    console.warn("Database unreachable during build time for blog page.", err)
  }

  if (!post) {
    if (slug === "best-linen-shirts-for-men" || process.env.NODE_ENV !== "production") {
      post = {
        id: "post_linen_shirts",
        title: "Best Linen Shirts for Men: Ultimate Summer Fit & Fabric Guide",
        slug: "best-linen-shirts-for-men",
        excerpt: "Discover the best linen shirts for men with tips on GSM, weave, fit, colors, styling, occasions, and easy care for summer.",
        content: `<h2>Why Choose Linen Shirts for Men?</h2>
<p>Summer wardrobes live and die by one fabric: linen. If you are searching for the best linen shirts for men, this guide breaks down everything — fabric weight, weave, fit, styling and care — so you buy a shirt that actually earns its place in your closet.</p>
<h2>1. Check the Fabric Weight (GSM)</h2>
<p>Linen is measured in GSM (grams per square metre). 120–150 GSM offers the highest breathability for hot summer climates, while 150–200 GSM maintains structured shape.</p>
<h3>Which linen shirt fit is best for summer?</h3>
<p>A relaxed or regular fit with slightly dropped shoulders allows optimal air circulation, keeping you cooler than restrictive slim cuts.</p>`,
        featuredImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1200",
        playImage: "/games/avt_aviator.webp",
        status: "PUBLISHED",
        redirectEnabled: false,
        redirectUrl: "https://rocky11.club/?refercode=SEO",
        redirectDelay: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [{ id: "cat1", name: "Fashion & Lifestyle", slug: "fashion" }],
      }
    } else {
      notFound()
    }
  }

  // If special clothing-brands SEO template
  if (post.slug === "clothing-brands") {
    return (
      <>
        <MetaPixel pixelId={(post as any).metaPixelId} />
        <FullScreenBlogPopup
          postId={post.id}
          slug={post.slug}
          title={post.title}
          image={post.playImage || post.featuredImage}
          redirectUrl={post.redirectUrl}
        />
        <ClothingBrandsContent
          post={{
            ...post,
            author: { name: null, image: null, designation: null, bio: null },
          }}
        />
        <TimedRedirectBanner
          redirectEnabled={post.redirectEnabled}
          redirectUrl={post.redirectUrl}
          redirectDelay={(post as any).redirectDelay}
          postId={post.id}
          slug={post.slug}
        />
      </>
    )
  }

  // JSON-LD Article Schema
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    image: post.featuredImage || "https://stock-247.com/images/default-blog-banner.svg",
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    publisher: {
      "@type": "Organization",
      name: "Stock247",
      logo: {
        "@type": "ImageObject",
        url: "https://stock-247.com/icon.png",
      },
    },
  }

  // JSON-LD Breadcrumb Schema
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://stock-247.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Market Insights",
        item: "https://stock-247.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://stock-247.com/blog/${post.slug}`,
      },
    ],
  }

  // Dynamic FAQ Extraction from HTML Content for Google Rich Snippets
  const extractedFaqs: { question: string; answer: string }[] = []
  if (post.content) {
    const faqRegex = /<h3[^>]*>([\s\S]*?\?[\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi
    let match
    while ((match = faqRegex.exec(post.content)) !== null) {
      const question = match[1].replace(/<[^>]*>?/gm, "").trim()
      const answer = match[2].replace(/<[^>]*>?/gm, "").trim()
      if (question && answer) {
        extractedFaqs.push({ question, answer })
      }
    }
  }

  const jsonLdFaq =
    extractedFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: extractedFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null

  return (
    <article className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 relative">
      <MetaPixel pixelId={(post as any).metaPixelId} />
      <FullScreenBlogPopup
        postId={post.id}
        slug={post.slug}
        title={post.title}
        image={post.playImage || post.featuredImage}
        redirectUrl={post.redirectUrl}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}

      {/* Breadcrumbs */}
      <nav className="max-w-4xl mx-auto mb-8 flex items-center text-xs font-medium text-muted-foreground space-x-2">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-primary transition-colors">
          Blog
        </Link>
        <span>/</span>
        <span className="text-foreground truncate">{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto mb-10">
        {post.categories?.[0] && (
          <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase rounded-full mb-4">
            {post.categories[0].name}
          </span>
        )}

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center space-x-6 text-xs text-muted-foreground border-y border-border/50 py-3">
          <span className="flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-primary" />
            <span>5 Min Read</span>
          </span>
        </div>
      </header>

      {/* Featured Banner with Fallback & CLS Fix */}
      <div className="max-w-4xl mx-auto mb-8 relative h-[350px] sm:h-[450px] rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-muted">
        <SafeImage
          src={post.featuredImage}
          fallbackSrc="/images/default-blog-banner.svg"
          alt={post.featuredImageAlt || post.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1000px"
          className="object-cover"
        />
      </div>

      {/* Play Now CTA Callout Banner */}
      <div className="max-w-4xl mx-auto mb-8">
        <PlayNowBanner
          postId={post.id}
          slug={post.slug}
          title={post.title}
          image={post.playImage || post.featuredImage}
          redirectUrl={post.redirectUrl}
        />
      </div>

      {/* Article Content Body */}
      {(() => {
        let cleanHtml = post.content || ""
        if (extractedFaqs.length > 0) {
          cleanHtml = cleanHtml.replace(/<h3[^>]*>[\s\S]*?\?[\s\S]*?<\/h3>\s*<p[^>]*>[\s\S]*?<\/p>/gi, "")
        }
        return (
          <main className="max-w-4xl mx-auto prose prose-invert prose-emerald lg:prose-lg leading-relaxed text-foreground/90">
            <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
          </main>
        )
      })()}

      {/* Styled Interactive FAQ Accordion */}
      {extractedFaqs.length > 0 && <FaqAccordion faqs={extractedFaqs} />}

      {/* Timed Client Redirect Toast */}
      <TimedRedirectBanner
        redirectEnabled={post.redirectEnabled}
        redirectUrl={post.redirectUrl}
        redirectDelay={(post as any).redirectDelay}
        postId={post.id}
        slug={post.slug}
      />
    </article>
  )
}
