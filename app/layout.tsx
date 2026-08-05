import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Outfit } from "next/font/google"
import { headers } from "next/headers"
import "./globals.css"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { LoadingScreen } from "@/components/layout/loading-screen"
import { CustomCursor } from "@/components/layout/custom-cursor"
import { ScrollProgress } from "@/components/layout/scroll-progress"
import { SmoothScrollProvider } from "@/components/layout/smooth-scroll-provider"
import { PageTransition } from "@/components/layout/page-transition"
import { Toaster } from "@/components/ui/toaster"
import { AiChatWrapper } from "@/features/ai/ai-chat-wrapper"
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker"

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { getThemeConfigData } from "@/services/system"
import { getNavDataCounts } from "@/services/navigation"

// ─── Fonts ────────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Dev Portfolio | Full Stack & AI Developer", template: "%s | Dev Portfolio" },
  description:
    "Full Stack & AI Developer, Computer Science Engineering student building modern, performant web experiences, AI solutions, and hackathon projects.",
  keywords: ["developer", "portfolio", "full stack", "AI developer", "CSE", "nextjs", "react", "typescript", "hackathon"],
  authors: [{ name: "Developer" }],
  creator: "Developer",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    siteName: "Dev Portfolio",
    title: "Dev Portfolio | Full Stack & AI Developer",
    description: "Full Stack & AI Developer building modern, performant web experiences.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Dev Portfolio | Full Stack & AI Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Portfolio | Full Stack & AI Developer",
    description: "Full Stack & AI Developer building modern, performant web experiences.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#020408",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Determine whether we're in an admin route to suppress public chrome.
  const headersList = await headers()
  const pathname = headersList.get("x-invoke-path") ?? headersList.get("x-pathname") ?? ""
  const isAdminRoute = pathname.startsWith("/admin")

  let logoText = "<Dev/>"
  let navCounts

  try {
    const [themeConfig, counts] = await Promise.all([
      getThemeConfigData().catch(() => null),
      getNavDataCounts().catch(() => undefined),
    ])
    if (themeConfig?.logo_text) {
      logoText = themeConfig.logo_text
    }
    navCounts = counts
  } catch (err) {
    // Fallback if DB fetch fails during build
  }

  // Structured Data JSON-LD Schemas
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Developer",
    "url": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    "sameAs": [
      "https://github.com",
      "https://linkedin.com",
    ],
    "jobTitle": "Full Stack Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance",
    }
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black font-[family-name:var(--font-inter)] text-white antialiased">
        <AnalyticsTracker />
        {isAdminRoute ? (
          // Admin routes: no public chrome, no smooth scroll, no custom cursor
          <>
            {children}
            <Toaster />
          </>
        ) : (
          <SmoothScrollProvider>
            <LoadingScreen />
            <CustomCursor />
            <ScrollProgress />
            <Navbar logoText={logoText} navCounts={navCounts} />
            <PageTransition>
              <div id="content">{children}</div>
            </PageTransition>
            <AiChatWrapper />
            <Footer logoText={logoText} navCounts={navCounts} />
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </SmoothScrollProvider>
        )}
      </body>
    </html>
  )
}
