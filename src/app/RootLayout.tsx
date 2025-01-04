import { SpeedInsights } from "@vercel/speed-insights/next";

import { client } from "@/lib/sanity/client";
import { navigationQuery } from "@/lib/sanity/queries";

import Header from "@/components/Layout/Header.component";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigation = await client.fetch(navigationQuery);

  return (
    <ErrorBoundary>
      <Header navigationLinks={navigation.links} />
      <SpeedInsights />
      {children}
      <SpeedInsights />
    </ErrorBoundary>
  );
}
