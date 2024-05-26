import Header from "@/components/header";
import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";

import type { Pagecontent } from "@/types/sanity.types";

import KontaktContent from "@/components/Kontakt/KontaktContent.component";

export default async function PostIndex() {
  const pageContent = groq`
*[_type == 'page']
`;

  const posts = await client.fetch<Pagecontent>(pageContent);

  console.log(posts);

  return (
    <>
      <Header />
     
      <KontaktContent />
    </>
  );
}
