"use client";

import Section from "./Section.component";
import type { Pagecontent } from "@/types/sanity.types";

interface IChild {
  _key: string;
  _type: string;
  marks: string[];
  text: string;
}

interface IText {
  _key: string;
  _type: string;
  children: IChild[];
  markDefs: string[];
  style: string;
}

interface IContent {
  id: string;
  text: IText[];
  title: string;
  variant: "default" | "alternate";
}

// Transform Sanity content to component format
const transformContent = (content: Pagecontent & { _key: string }): IContent => {
  return {
    id: content._key,
    text: content.text?.map(block => ({
      _key: block._key,
      _type: block._type,
      children: block.children?.map(child => ({
        _key: child._key,
        _type: child._type,
        marks: child.marks || [],
        text: child.text || ''
      })) || [],
      markDefs: block.markDefs?.map(def => def._key) || [],
      style: block.style || 'normal'
    })) || [],
    title: content.title || '',
    variant: 'default' // Will be overridden in the map function
  };
};

/**
 * IndexContent component that renders multiple content sections with alternating visual styles
 * @param {Object} props - The props for the IndexContent component
 * @param {Array<Pagecontent & { _key: string }>} props.pageContent - Array of content sections to render
 * @returns {JSX.Element} The rendered IndexContent component
 * @throws {Error} Throws an error if no content is available
 */
const IndexContent = ({ 
  pageContent 
}: { 
  pageContent: Array<Pagecontent & { _key: string }> 
}) => {
  if (!pageContent || pageContent.length === 0) {
    throw new Error("Ingen innhold tilgjengelig");
  }

  return (
    <div className="w-screen md:w-full overflow-hidden -mb-8">
      {pageContent.map((page, index) => {
        const content = transformContent(page);
        content.variant = index % 2 === 0 ? "default" : "alternate";
        
        return <Section key={content.id} {...content} />;
      })}
    </div>
  );
};

export default IndexContent;
