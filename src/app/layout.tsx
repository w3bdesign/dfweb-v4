import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

import { sanityFetch } from "@/lib/sanity/client";
import { navigationQuery, settingsQuery } from "@/lib/sanity/queries";
import type { Navigation, Settings } from "@/types/sanity.types";
import LazyMotionProvider from "@/lib/framer/LazyMotionProvider";

import SkipLink from "@/components/UI/SkipLink.component";
import Header from "@/components/Layout/Header.component";
import Footer from "@/components/Layout/Footer.component";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap", // Prevent invisible text during font load (improves FCP)
  preload: true, // Preload font to reduce request chain
});

export const metadata: Metadata = {
  title: "Forside - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navigation, settings] = await Promise.all([
    sanityFetch<Navigation>({ query: navigationQuery, revalidate: 86400 }), // 24 hours
    sanityFetch<Settings>({ query: settingsQuery, revalidate: 86400 }), // 24 hours
  ]);

  const footerCopyrightText = settings?.footerCopyrightText;

  return (
    <html lang="nb">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />

        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />

        <meta property="og:title" content="Daniel Fjeldstad" />
        <meta name="author" content="Daniel Fjeldstad" />
        <meta property="og:locale" content="nb_NO" />
        <meta
          property="og:description"
          content="Daniel Fjeldstad | Frontend Web Utvikler | Portefølje"
        />

        <meta property="og:url" content="https://www.dfweb.no/" />
        <meta property="og:site_name" content="dfweb.no" />
        <meta name="theme-color" content="#004014" />
      </head>

      <body
        className={`flex flex-col min-h-screen bg-slate-900 leading-relaxed text-slate-300/[0.9] antialiased selection:bg-teal-300 selection:text-teal-900 ${jetbrainsMono.className}`}
      >
        <LazyMotionProvider>
          <SkipLink />
          <ErrorBoundary>
            <div id="main-content" className="grow flex flex-col">
              <Header navigation={navigation} />
              <SpeedInsights />
              <div className="grow">{children}</div>
              <Footer
                footerCopyrightText={
                  footerCopyrightText ?? "Copyright Daniel Fjeldstad"
                }
              />
            </div>
          </ErrorBoundary>
        </LazyMotionProvider>
      </body>
    </html>
  );
}
