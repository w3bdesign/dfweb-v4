import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { sanityFetch } from "@/lib/sanity/client";
import { pageContentQuery } from "@/lib/sanity/queries";
import ContentLoader from "@/components/UI/ContentLoader.component";
import type { Page } from "@/types/sanity.types";

export const metadata: Metadata = {
  title: "Forside - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

// ISR - regenerate every 24 hours
export const revalidate = 86400;

const DynamicHero = dynamic(() => import("@/components/Index/Hero.component"), {
  loading: () => <ContentLoader type="hero" />,
});

const DynamicIndexContent = dynamic(
  () => import("@/components/Index/IndexContent.component"),
  {
    loading: () => <ContentLoader type="section" sections={3} />,
  },
);

export default async function HomePage() {
  const pageContent = await sanityFetch<Page | null>({
    query: pageContentQuery,
    revalidate: 86400, // 24 hours
  });

  if (!pageContent) notFound();

  return (
    <main>
      <div className="mt-[4.5rem] md:mt-32 overflow-hidden">
        {pageContent?.hero && <DynamicHero content={pageContent.hero} />}
      </div>
      {pageContent?.content && (
        <DynamicIndexContent pageContent={pageContent.content} />
      )}
    </main>
  );
}
