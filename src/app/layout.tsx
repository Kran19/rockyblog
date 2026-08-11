import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stock-247.com"),
  title: "Stock247 - Real-Time Market Insights, Stock Signals & Trading Guides",
  description: "Elite destination for stock market analysis, options trading strategies, algorithmic market insights, and crash game mechanics.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Stock247 - Real-Time Market Insights, Stock Signals & Trading Guides",
    description: "Elite destination for stock market analysis, options trading strategies, algorithmic market insights, and crash game mechanics.",
    url: "/",
    siteName: "Stock247",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stock247 - Real-Time Market Insights & Stock Signals",
    description: "Elite destination for stock market analysis, options trading strategies, algorithmic market insights, and crash game mechanics.",
  },
  verification: {
    google: "GwBrIU3Un37BTLPfnQINBwTKAjWjO4zTcVVAqkvt3Dw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} antialiased`}>
      <body className={`${outfit.className} min-h-screen flex flex-col bg-background font-sans`}>
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
