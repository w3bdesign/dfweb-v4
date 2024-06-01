import { groq } from "next-sanity";

import Header from "@/components/Layout/Header.component";
import Hero from "@/components/Index/Hero.component";
import Testing from "@/components/Index/Testing";

import { client } from "@/lib/sanity/client";

export default async function PostIndex() {
  const pageContent = groq`
 *[_type == 'page' && title match 'Hjem']{"id": _id, title, hero, content}
`;

  const posts = await client.fetch(pageContent);

  console.log(posts);

  return (
    <>
      <Header />
      <div className="mt-32">
        {posts[0].hero && <Hero content={posts[0].hero} />}
      </div>
      {posts[0].content && <Testing pageContent={posts[0].content} />}
    </>
  );
}
