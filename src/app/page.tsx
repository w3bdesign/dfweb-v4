import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { sanityFetch } from "@/lib/sanity/client";
import { pageContentQuery } from "@/lib/sanity/queries";
import type { Page } from "@/types/sanity.types";
import Hero from "@/components/Index/Hero.component";
import IndexContent from "@/components/Index/IndexContent.component";

export const metadata: Metadata = {
  title: "Forside - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

// ISR - regenerate every 24 hours
export const revalidate = 86400;

export default async function HomePage() {
  const pageContent = await sanityFetch<Page | null>({
    query: pageContentQuery,
    revalidate: 86400, // 24 hours
  });

  if (!pageContent) notFound();

  return (
    <main>
      <div className="mt-[4.5rem] md:mt-32 overflow-hidden">
        {pageContent?.hero && <Hero content={pageContent.hero} />}
      </div>
      {pageContent?.content && (
        <IndexContent pageContent={pageContent.content} />
      )}
    </main>
  );
}
