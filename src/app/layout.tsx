import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import "./glitch.css";

import SkipLink from "@/components/UI/SkipLink.component";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Forside - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />

        <meta property="og:title" content="Daniel Fjeldstad" />
        <meta name="author" content="Daniel Fjeldstad" />
        <meta property="og:locale" content="nb_NO" />
        <meta
          name="description"
          content="Daniel Fjeldstad | Frontend Web Utvikler | Portefølje"
        />
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
        <div id="main-content" className="grow flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
