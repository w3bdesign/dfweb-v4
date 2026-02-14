import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import "./glitch.css";

import { client } from "@/lib/sanity/client";
import { navigationQuery, settingsQuery } from "@/lib/sanity/queries";

import SkipLink from "@/components/UI/SkipLink.component";
import Header from "@/components/Layout/Header.component";
import Footer from "@/components/Layout/Footer.component";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Forside - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navigation, { footerCopyrightText }] = await Promise.all([
    client.fetch(navigationQuery),
    client.fetch(settingsQuery),
  ]);

  return (
    <html lang="nb">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />
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
        className={`flex flex-col min-h-screen bg-slate-900 leading-relaxed text-slate-300/[0.9] antialiased selection:bg-teal-300 selection:text-teal-900 ${inter.className}`}
      >
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
      </body>
    </html>
  );
}
