import Header from "@/components/header";
import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";

import type { Pagecontent } from "@/types/sanity.types";

import CVContent from "@/components/CV/CVContent.component";

export default async function PostIndex() {
  const pageContent = groq`
*[_type == 'page']
`;

  const posts = await client.fetch<Pagecontent>(pageContent);

  console.log(posts);

  return (
    <>
      <Header />
      <h1>Page</h1>
      <div><CVContent /></div>
    </>
  );
}
