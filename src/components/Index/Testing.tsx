"use client";

import { PortableText } from "@portabletext/react";
import { Fragment } from "react";

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
    bold: ({ children }) => <b>{children}</b>,
    italic: ({ children }) => <i>{children}</i>,
    code: ({ children }) => <span class="mt-4 text-lg">{children}</span>,
  },
};

const Section = ({ text, title }: IContent) => (
  <section aria-label={title} data-testid="sanity-section">
    <div className="mt-4 p-8 text-lg text-black bg-white rounded shadow h-full -mb-10">
      <BounceInScroll viewAmount={0}>
        <h2
          data-testid="sanity-title"
          data-cy={title}
          className="text-3xl text-center"
        >
          {title}
        </h2>
        <br />
        <PortableText value={text} components={myPortableTextComponents} />
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
