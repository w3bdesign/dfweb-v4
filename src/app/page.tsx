import { groq } from "next-sanity";
import dynamic from "next/dynamic";

import Header from "@/components/Layout/Header.component";
import { client } from "@/lib/sanity/client";

const DynamicHero = dynamic(() => import("@/components/Index/Hero.component"), {
  ssr: false,
});

const DynamicIndexContent = dynamic(
  () => import("@/components/Index/IndexContent.component"),
  { ssr: false },
);

export default async function PostIndex() {
  const query = groq`{
    "pageContent": *[_type == 'page' && title match 'Hjem'][0]{"id": _id, title, hero, content},
    "navigation": *[_type == "navigation"][0] {
      title,
      links[] {
        title,
        name,
        hash,
        href,
        externalLink
      }
    }
  }`;

  const { pageContent, navigation } = await client.fetch(query);

  return (
    <>
      <Header navigationLinks={navigation.links} />
      <main>
        <div className="mt-[4.5rem] md:mt-32 overflow-hidden">
          {pageContent.hero && <DynamicHero content={pageContent.hero} />}
        </div>
        {pageContent.content && (
          <DynamicIndexContent pageContent={pageContent.content} />
        )}
      </main>
    </>
  );
}