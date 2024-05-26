import { client } from "@/utils/sanity/client";
import { groq } from "next-sanity";

export default async function PostIndex() {
  const pageContent = groq`
*[_type == 'page']
`;

  const posts = await client.fetch<any>(pageContent);

  console.log(posts);

  return posts.map((post: any) => <h1>{JSON.stringify(post)}</h1>);
}
