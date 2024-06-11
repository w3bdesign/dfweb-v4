import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Footer from "@/components/Layout/Footer.component";

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
    <html lang="en">
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
      </head>

      <body className={`flex flex-col min-h-screen ${inter.className}`}>
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
