"use client";

import { PortableText } from "@portabletext/react";
import { Fragment } from "react";

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
  },
};

const Section = ({ text, title }: IContent) => (
  <section aria-label={title} data-testid="sanity-section" className="py-6">
    <div className="mt-4 p-8 text-lg text-black bg-white rounded shadow h-full -mb-10">
      <BounceInScroll viewAmount={0}>
        <h2
          data-testid="sanity-title"
          data-cy={title}
          className="text-3xl text-center mt-4"
        >
          {title}
        </h2>
        <div className="flex justify-center">
          <div className="mt-4 text-lg text-left max-w-2xl">
            <PortableText value={text} components={myPortableTextComponents} />
          </div>
        </div>
      </BounceInScroll>
    </div>
  </section>
);

const Testing = ({ pageContent }: { pageContent: IContent[] }) => {
  console.log("Page Content er:", pageContent);

  return (
    <Fragment>
      {pageContent?.map((page) => <Section key={page.id} {...page} />)}
    </Fragment>
  );
};

export default Testing;
