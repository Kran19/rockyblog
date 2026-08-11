import { prisma } from "../src/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  console.log("Seeding Stock247 database...")

  // Clean up existing data
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash("password123", 10)
  const admin = await prisma.user.create({
    data: {
      email: "admin@stock-247.com",
      name: "Stock247 Market Team",
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  })
  console.log("Admin user created: admin@stock-247.com (password123)")

  // 2. Create Stock & Trading Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Stock Analysis",
        slug: "stock-analysis",
        description: "Technical chart analysis, earnings previews, and stock market signals.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Options & Futures",
        slug: "options-trading",
        description: "Options strategies, call/put flow analysis, and gamma squeeze setups.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Crypto & Digital Assets",
        slug: "crypto",
        description: "Bitcoin, Ethereum, DeFi market movements, and blockchain telemetry.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Crash Market Arcade",
        slug: "crash-games",
        description: "Aviator, Chicken Crossy, and high-speed multiplier arcade strategies.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Algorithmic Insights",
        slug: "trading-tools",
        description: "Quantitative trading models, risk management rules, and automated signals.",
      },
    }),
  ])
  console.log(`Created ${categories.length} stock & market categories.`)

  // 3. Create Posts Data (High-converting stock, trading, & arcade market posts)
  const postsData = [
    {
      title: "The Ultimate Guide to Stock Market Trading 2026: Technical Analysis & Risk Management",
      slug: "ultimate-stock-market-trading-guide-2026",
      excerpt: "Master stock technical analysis, liquidity zone identification, options order flow, and risk management strategies to trade profitability in 2026.",
      content: `<h2>1. The Foundation of Stock Technical Analysis</h2>
<p>Modern stock trading relies heavily on understanding institutional liquidity, support/resistance key levels, and volume profile metrics. Successful market execution starts with identifying primary trend direction before entering high-probability setups.</p>
<h2>2. Reading Price Action & Candlestick Patterns</h2>
<p>Candlesticks provide immediate telemetry on market sentiment. Look for bullish hammer rejections at key moving average support (e.g. 20 EMA / 50 SMA) and high-volume breakout patterns.</p>
<h2>3. Risk Management & Capital Preservation Rules</h2>
<p>Never risk more than 1% to 2% of total trading portfolio equity on any single trade setup. Always set automated stop-loss orders to eliminate emotional decision making.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200",
      status: "PUBLISHED" as any,
      redirectEnabled: true,
      redirectUrl: "https://rocky11.club/?refercode=SEO",
      redirectDelay: 3,
      metaPixelId: "1039520809035030",
      metaTitle: "Stock Market Trading Guide 2026 | Technical Analysis & Signals",
      metaDescription: "Master stock technical analysis, liquidity zones, options order flow, and risk management strategies for 2026.",
      focusKeyword: "stock trading guide 2026",
      categoryId: categories[0].id,
    },
    {
      title: "Aviator Crash Game Strategy & Multiplier Signals: How to Win Big",
      slug: "aviator-game-how-to-play-rules-strategy",
      excerpt: "Explore the complete strategy guide for the Aviator crash game, featuring provably fair mechanics, RTP analysis, and automated multiplier cashout techniques.",
      content: `<h2>Understanding Aviator Multiplier Mechanics</h2>
<p>Aviator is built on a Provably Fair cryptographic algorithm. The multiplier curve begins at 1.00x and can scale exponentially up to 10,000x before crashing.</p>
<h2>Optimal Cashout & Risk Mitigation Strategy</h2>
<p>Utilize dual-betting functionality: Set Bet 1 to auto-cashout at a safe 1.50x multiplier to cover round wagers, while letting Bet 2 ride for high 10x+ multiplier rewards.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000",
      status: "PUBLISHED" as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[3].id,
    },
    {
      title: "Options Trading 101: Calls, Puts & Gamma Squeeze Identification",
      slug: "options-trading-calls-puts-gamma-squeeze",
      excerpt: "Learn how options contracts work, how to evaluate delta and theta decay, and how to spot institutional unusual options activity before big breakouts.",
      content: `<h2>What Are Call and Put Options?</h2>
<p>Options grant contract holders the right to buy (Call) or sell (Put) underlying stocks at an agreed strike price before contract expiration dates.</p>
<h2>Spotting Institutional Gamma Flow</h2>
<p>Heavy buying in short-dated out-of-the-money call options forces market makers to buy underlying stock shares, accelerating explosive upward price momentum known as a gamma squeeze.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000",
      status: "PUBLISHED" as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[1].id,
    },
    {
      title: "Chicken Crossy Game Guide: Rules, Multipliers & Winning Tips",
      slug: "chicken-crossy-game-guide",
      excerpt: "Chicken Crossy is a high-speed arcade betting game where safe lane steps increase your reward multiplier. Discover the best cashout strategies.",
      content: `<h2>Chicken Crossy Gameplay Overview</h2>
<p>Navigate the chicken across busy lanes to build step multipliers. Each safe step increases potential payout rewards exponentially.</p>
<h2>Bankroll Preservation Tips</h2>
<p>Cap per-step risk at 3 steps before securing profits to achieve consistent round gains with zero high-variance wipeouts.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000",
      status: "PUBLISHED" as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[3].id,
    },
    {
      title: "Top 5 AI Stock Trading Signals & Indicators for 2026",
      slug: "top-ai-stock-trading-signals-2026",
      excerpt: "Artificial intelligence models are revolutionizing stock analysis. Here are the top 5 AI-powered indicators used by quantitative stock traders today.",
      content: `<h2>The Rise of Algorithmic Stock Signals</h2>
<p>Machine learning models analyze multi-asset correlations, social sentiment metrics, and order book pressure in real time to generate precise entry signals.</p>
<h2>Top Indicators: VWAP, Volume Delta, and Moving Average Envelopes</h2>
<p>Combining VWAP with cumulative volume delta enables traders to spot smart money accumulation ahead of market momentum sweeps.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=1000",
      status: "PUBLISHED" as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[4].id,
    },
    {
      title: "Crypto Market Forecast 2026: Bitcoin Halving Cycles & Altcoin Season",
      slug: "crypto-market-forecast-2026-bitcoin-altcoins",
      excerpt: "An in-depth quantitative analysis of Bitcoin price cycles, institutional ETF inflows, and high-probability altcoin breakout patterns.",
      content: `<h2>Bitcoin Structural Cycle Analysis</h2>
<p>Historical post-halving dynamics confirm that Bitcoin supply contraction paired with steady institutional ETF buying drives strong multi-quarter bull runs.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
      status: "PUBLISHED" as any,
      redirectEnabled: false,
      redirectUrl: null,
      categoryId: categories[2].id,
    },
  ]

  for (const postData of postsData) {
    const { categoryId, ...data } = postData
    await prisma.post.create({
      data: {
        ...data,
        authorId: admin.id,
        categories: {
          connect: { id: categoryId },
        },
      },
    })
  }
  console.log(`Created ${postsData.length} stock & market posts successfully.`)

  console.log("Stock247 seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
