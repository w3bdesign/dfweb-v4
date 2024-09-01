"use client";

import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextMarkComponentProps } from "@portabletext/react";
import BounceInScroll from "../Animations/BounceInScroll.component";

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

const myPortableTextComponents = {
  marks: {
    bold: ({ children }: PortableTextMarkComponentProps) => <b>{children}</b>,
    italic: ({ children }: PortableTextMarkComponentProps) => <i>{children}</i>,
    code: ({ children }: PortableTextMarkComponentProps) => (
      <span className="mt-4 text-lg block">{children}</span>
    ),
    link: ({ text, value }: PortableTextMarkComponentProps) => (
      <Link
        className="glitch underline text-lg font-bold text-green-400"
        href={value?.href || '#'}
        data-text={text}
      >
        {text}
      </Link>
    ),
  },
};

const Section = ({ text, title }: IContent) => {
  if (!title || !text) {
    console.error(`Invalid section data: title=${title}, text=${JSON.stringify(text)}`);
    return null;
  }

  return (
    <section aria-label={title} data-testid="sanity-section" className="md:py-6">
      <div className="p-6 text-lg rounded h-full">
        <BounceInScroll viewAmount={0}>
          <h2
            data-testid="sanity-title"
            data-cy={title}
            className="text-3xl text-center text-slate-200"
          >
            {title}
          </h2>
          <div className="flex justify-center">
            <div className="mt-4 text-lg text-left md:max-w-3xl">
              <PortableText value={text} components={myPortableTextComponents} />
            </div>
          </div>
        </BounceInScroll>
      </div>
    </section>
  );
};

const IndexContent = ({ pageContent }: { pageContent: IContent[] }) => {
  if (!pageContent || pageContent.length === 0) {
    console.error('No page content available');
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-500">Error: No content available</h2>
        <p className="mt-2 text-gray-600">Please try refreshing the page or contact support if the issue persists.</p>
      </div>
    );
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
