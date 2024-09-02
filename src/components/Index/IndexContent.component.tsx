"use client";

import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextMarkComponentProps } from "@portabletext/react";
import BounceInScroll from "../Animations/BounceInScroll.component";
import Button from "../UI/Button.component";
import { useState } from "react";

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
    link: ({ text, value }: PortableTextMarkComponentProps) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith('http') || href.startsWith('//');
      
      return (
        <Link
          className="glitch underline text-lg font-bold text-green-400"
          href={href}
          data-text={text}
          {...(isExternal ? {
            target: "_blank",
            rel: "noopener noreferrer",
          } : {})}
        >
          {text}
          {isExternal && (
            <>
              <span className="sr-only"> (opens in a new tab)</span>
              <span aria-hidden="true"> ↗</span>
            </>
          )}
        </Link>
      );
    },
  },
};

const Section = ({ text, title }: IContent) => {
  const [shouldError, setShouldError] = useState(false);

  if (!title || !text) {
    console.error(
      `Ugyldig seksjon data: tittel=${title}, tekst=${JSON.stringify(text)}`,
    );
    return null;
  }

  if (shouldError) {
    throw new Error("En uventet feil har oppstått");
  }

  return (
    <section
      aria-label={title}
      data-testid="sanity-section"
      className="md:py-6"
    >
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
              <PortableText
                value={text}
                components={myPortableTextComponents}
              />
            </div>
          </div>
          {process.env.NODE_ENV === "development" && (
            <Button onClick={() => setShouldError(true)} type="button">
              Utløs Testfeil
            </Button>
          )}
        </BounceInScroll>
      </div>
    </section>
  );
};

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
