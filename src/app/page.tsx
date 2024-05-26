import Header from "@/components/header";
import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";

import type { Pagecontent } from "../../studio/sanity.types";

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
      <div>
        {posts.map((post: any) => (
          <h1 key={post._id}>{JSON.stringify(post)}</h1>
        ))}
      </div>
    </>
  );
}
