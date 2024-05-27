import { groq } from "next-sanity";

import Header from "@/components/Layout/Header.component";
import { client } from "@/lib/sanity/client";

import type { Pagecontent } from "@/types/sanity.types";

export default async function PostIndex() {
  const pageContent = groq`
*[_type == 'page']
`;

  const posts = await client.fetch<Pagecontent>(pageContent);

  console.log(posts);

  return (
    <>
      <Header />
      <div>Hjem</div>
    </>
  );
}
