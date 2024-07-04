import { groq } from "next-sanity";

import { client } from "@/lib/sanity/client";

import Header from "@/components/Layout/Header.component";

import type { Pagecontent } from "@/types/sanity.types";

import KontaktContent from "@/components/Kontakt/KontaktContent.component";

export default async function PostIndex() {
  const pageContent = groq`
*[_type == 'page']
`;

  const posts = await client.fetch<Pagecontent>(pageContent);

  return (
    <>
      <Header />
      <KontaktContent />
    </>
  );
}
