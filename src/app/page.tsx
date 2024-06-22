import { groq } from "next-sanity";

import Header from "@/components/Layout/Header.component";
import Hero from "@/components/Index/Hero.component";
import IndexContent from "@/components/Index/IndexContent.component";

import { client } from "@/lib/sanity/client";

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
          {posts[0].hero && <Hero content={posts[0].hero} />}
        </div>
        {posts[0].content && <IndexContent pageContent={posts[0].content} />}
      </main>
    </>
  );
}
