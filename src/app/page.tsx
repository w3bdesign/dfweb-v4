import { groq } from "next-sanity";
import dynamic from "next/dynamic";

import RootLayout from "./RootLayout";
import { client } from "@/lib/sanity/client";

const DynamicHero = dynamic(() => import("@/components/Index/Hero.component"), {
  ssr: false,
});

const DynamicIndexContent = dynamic(
  () => import("@/components/Index/IndexContent.component"),
  { ssr: false },
);

// Fetch and render the HomePage
export default async function HomePage() {
  // Fetch the page content from Sanity
  const pageContentQuery = groq`
    *[_type == 'page' && title match 'Hjem'][0]{
      "id": _id, 
      title, 
      hero, 
      content
    }
  `;

  const pageContent = await client.fetch(pageContentQuery);

  return (
    <RootLayout>
      <main>
        <div className="mt-[4.5rem] md:mt-32 overflow-hidden">
          {/* Render the DynamicHero component with the fetched hero content */}
          {pageContent.hero && <DynamicHero content={pageContent.hero} />}
        </div>
        {/* Render the DynamicIndexContent component with the fetched page content */}
        {pageContent.content && (
          <DynamicIndexContent pageContent={pageContent.content} />
        )}
      </main>
    </RootLayout>
  );
}
