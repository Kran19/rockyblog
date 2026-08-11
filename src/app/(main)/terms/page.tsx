import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - Stock247",
  description: "Terms of Service for Stock247 (stock-247.com) market analysis blog.",
  alternates: {
    canonical: "/terms",
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-24">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full -z-10" />
      
      <div className="container mx-auto max-w-4xl px-4 relative z-10">
        <div className="glass-card rounded-3xl border border-emerald-500/20 shadow-2xl backdrop-blur-xl bg-background/60 p-8 md:p-12 lg:p-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          
          <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground max-w-none prose-a:text-emerald-400 hover:prose-a:text-emerald-300">
            <p>Last updated: August 11, 2026</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Stock247 (stock-247.com, "the Website"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Website.
            </p>

            <h2>2. User Content & Conduct</h2>
            <p>
              When interacting with the Website, you agree not to post any content that is unlawful, harmful, or misleading. We reserve the right to remove any content that violates these guidelines.
            </p>

            <h2>3. Intellectual Property</h2>
            <p>
              All content on the Website, including text, market graphics, logos, images, and software, is the property of Stock247 or its content suppliers and is protected by international copyright laws.
            </p>

            <h2>4. Limitation of Liability</h2>
            <p>
              In no event shall Stock247, its authors, or its affiliates be liable for any financial decisions, investment losses, or damages arising out of your use of the Website.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

