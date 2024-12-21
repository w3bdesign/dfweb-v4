import { client } from "@/lib/sanity/client";
import Header from "@/components/Layout/Header.component";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import { navigationQuery } from "@/lib/sanity/queries";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigation = await client.fetch(navigationQuery);

  return (
    <ErrorBoundary>
      <Header navigationLinks={navigation.links} />
      {children}
    </ErrorBoundary>
  );
}
