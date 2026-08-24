import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { getPageContent } from "@/lib/sanity/content";
import Hero from "@/components/Index/Hero.component";
import IndexContent from "@/components/Index/IndexContent.component";

export const metadata: Metadata = {
  title: "Forside - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

// ISR - regenerate every 24 hours
export const revalidate = 86400;

export default async function HomePage() {
  const pageContent = await getPageContent();

  if (!pageContent) notFound();

  const { hero, content } = pageContent;

  return (
    <main>
      <div className="mt-[4.5rem] md:mt-32 overflow-hidden">
        {hero && <Hero content={hero} />}
      </div>
      {content && <IndexContent pageContent={content} />}
    </main>
  );
}
