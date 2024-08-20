import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ErrorBoundary } from "react-error-boundary";

import "./globals.css";
import "./glitch.css";

import Footer from "@/components/Layout/Footer.component";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Forside - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

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

      <body
        className={`flex flex-col min-h-screen bg-slate-900 leading-relaxed text-slate-400 antialiased selection:bg-teal-300 selection:text-teal-900 ${inter.className}`}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="flex-grow">{children}</div>
        </ErrorBoundary>
        <Footer />
      </body>
    </html>
  );
}
