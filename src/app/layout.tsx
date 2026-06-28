import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Football Legends Ranking | Premium Football Analytics",
  description:
    "Ranking the greatest football legends based on club success, international trophies, and individual awards. A premium football analytics platform.",
  keywords: [
    "football",
    "soccer",
    "legends",
    "ranking",
    "Messi",
    "Ronaldo",
    "Pele",
    "Maradona",
    "analytics",
  ],
  openGraph: {
    title: "Football Legends Ranking",
    description:
      "Ranking the greatest football legends based on achievements, trophies, and awards.",
    type: "website",
    siteName: "Football Legends Ranking",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Football Legends Ranking",
    description:
      "Ranking the greatest football legends based on achievements, trophies, and awards.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111111" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Football Legends Ranking",
              description:
                "Ranking the greatest football legends based on club success, international trophies, and individual awards.",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://football-legends-ranking.vercel.app",
            }),
          }}
        />
      </head>
      <body className="min-h-full font-sans bg-[#111111] text-white dark:bg-[#111111] dark:text-white">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
