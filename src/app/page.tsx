import { groq } from "next-sanity";

import { client } from "@/lib/sanity/client";

import Header from "@/components/Layout/Header.component";

import Hero from "@/components/Index/Hero.component";

import Testing from "@/components/Index/Testing";

export default async function PostIndex() {
  const pageContent = groq`
 *[_type == 'page' && title match 'Hjem']{"id": _id, title, hero, content}
`;

  const posts = await client.fetch<any>(pageContent);

  console.log(posts);

  return (
    <>
      <Header />
      {posts[0].hero && <Hero content={posts[0].hero} />}
      {posts[0].content &&<Testing pageContent={posts[0].content} />}
    </>
  );
}
