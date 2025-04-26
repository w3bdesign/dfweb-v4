"use client";

import Section from "./Section.component";
import type { Pagecontent } from "@/types/sanity.types";

/**
 * IndexContent component that renders multiple content sections with alternating visual styles
 * @param {Object} props - The props for the IndexContent component
 * @param {Pagecontent[]} props.pageContent - Array of content sections from Sanity to render. Each section alternates between default and alternate variant
 * @returns {JSX.Element} The rendered IndexContent component
 * @throws {Error} Throws an error if no content is available
 */
const IndexContent = ({ pageContent }: { pageContent: Pagecontent[] }) => {
  if (!pageContent || pageContent.length === 0) {
    throw new Error("Ingen innhold tilgjengelig");
  }

  return (
    <div className="w-screen md:w-full overflow-hidden -mb-8">
      {pageContent.map((page, index) => (
        <Section
          key={page.id}
          {...page}
          variant={index % 2 === 0 ? "default" : "alternate"}
        />
      ))}
    </div>
  );
};

export default IndexContent;
