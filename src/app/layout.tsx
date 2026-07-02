import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { DiscussionPanel } from "@/components/discussions/discussion-panel";
import { Analytics } from "@vercel/analytics/react";
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem("football-legends-theme");
                  if (t === "dark" || t === "light") {
                    if (t === "dark") document.documentElement.classList.add("dark");
                    else document.documentElement.classList.remove("dark");
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
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
      <body className="min-h-full font-sans text-foreground bg-background">
        <ThemeProvider>
          <TooltipProvider>
            <ToastProvider>
              {children}
              <DiscussionPanel />
              <Analytics />
            </ToastProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
