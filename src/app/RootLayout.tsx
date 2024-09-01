import { groq } from "next-sanity";
import { client } from "@/lib/sanity/client";
import Header from "@/components/Layout/Header.component";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

const navigationQuery = groq`
  *[_type == "navigation"][0] {
    title,
    links[] {
      title,
      name,
      hash,
      href,
      externalLink
    }
  }
`;

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
