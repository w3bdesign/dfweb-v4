import { SpeedInsights } from "@vercel/speed-insights/next";

import { client } from "@/lib/sanity/client";
import { navigationQuery, settingsQuery } from "@/lib/sanity/queries";

import Header from "@/components/Layout/Header.component";
import Footer from "@/components/Layout/Footer.component";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

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
    <ErrorBoundary>
      <div className="flex flex-col grow">
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
  );
}
