"use client";

import Section from "./Section.component";

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
}

/**
 * IndexContent component that renders multiple content sections
 * @param {Object} props - The props for the IndexContent component
 * @param {IContent[]} props.pageContent - Array of content sections to render
 * @returns {JSX.Element} The rendered IndexContent component
 * @throws {Error} Throws an error if no content is available
 */
const IndexContent = ({ pageContent }: { pageContent: IContent[] }) => {
  if (!pageContent || pageContent.length === 0) {
    throw new Error("Ingen innhold tilgjengelig");
  }

  return (
    <div className="md:mt-8 w-screen md:w-full overflow-hidden">
      {pageContent.map((page) => (
        <Section key={page.id} {...page} />
      ))}
    </div>
  );
};

export default IndexContent;
