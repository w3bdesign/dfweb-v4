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
  const pageContent = groq`
    *[_type == 'page' && title match 'Hjem']{"id": _id, title, hero, content}
  `;

  const posts = await client.fetch(pageContent);

  return (
    <>
      <Header />
      <main>
        <div className="mt-[4.5rem] md:mt-32 overflow-hidden">
          {posts[0].hero && <DynamicHero content={posts[0].hero} />}
        </div>
        {posts[0].content && (
          <DynamicIndexContent pageContent={posts[0].content} />
        )}
      </main>
    </>
  );
}
