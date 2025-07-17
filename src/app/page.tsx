import dynamic from "next/dynamic";
import RootLayout from "@/app/RootLayout";
import { client } from "@/lib/sanity/client";
import { pageContentQuery } from "@/lib/sanity/queries";
import IndexContentLoader from "@/components/Index/IndexContentLoader.component";
import HeroSkeleton from "@/components/Index/HeroSkeleton.component";

const DynamicHero = dynamic(() => import("@/components/Index/Hero.component"), {
  loading: () => <HeroSkeleton />,
});

const DynamicIndexContent = dynamic(
  () => import("@/components/Index/IndexContent.component"),
  {
    loading: () => <IndexContentLoader />,
  },
);

export default async function HomePage() {
  const pageContent = await client.fetch(pageContentQuery);

  return (
    <RootLayout>
      <main>
        <div className="mt-[4.5rem] md:mt-32 overflow-hidden">
          {pageContent?.hero && <DynamicHero content={pageContent.hero} />}
        </div>
        {pageContent?.content && (
          <DynamicIndexContent pageContent={pageContent.content} />
        )}
      </main>
    </RootLayout>
  );
}
