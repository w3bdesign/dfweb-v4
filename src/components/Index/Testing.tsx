"use client";
//import PortableText from "react-portable-text";
import { PortableText } from "@portabletext/react";
import { Fragment } from "react";
import BounceInScroll from "../Animations/BounceInScroll.component";
import { Pagecontent } from "../../../studio/sanity.types";

const Section = ({ text, title }: any) => (
  <section aria-label={title} data-testid="sanity-section">
    <div className="mt-4 p-8 text-lg text-black bg-white rounded shadow h-full -mb-10">
      Title er: {title}
      Tekst er: {text}
      <BounceInScroll viewAmount={0}>
        <h2
          data-testid="sanity-title"
          data-cy={title}
          className="text-3xl text-center"
        >
          {title}
        </h2>
        <br />
        <PortableText value={text} />
      </BounceInScroll>
    </div>
  </section>
);

const renderText = (textArray) => {
  return textArray.map((block) => {
    if (block._type === "block") {
      const children = block.children?.map((child) => {
        return <span key={child._key}>{child.text}</span>;
      });

      switch (block.style) {
        case "h1":
          return <h1 key={block._key}>{children}</h1>;
        case "h2":
          return <h2 key={block._key}>{children}</h2>;
        case "h3":
          return <h3 key={block._key}>{children}</h3>;
        case "h4":
          return <h4 key={block._key}>{children}</h4>;
        case "h5":
          return <h5 key={block._key}>{children}</h5>;
        case "h6":
          return <h6 key={block._key}>{children}</h6>;
        case "blockquote":
          return <blockquote key={block._key}>{children}</blockquote>;
        default:
          return <p key={block._key}>{children}</p>;
      }
    }

    return null;
  });
};

const Testing = ({ pageContent }: { pageContent: Pagecontent[] }) => {
  console.log("Page Content er:", pageContent);

  return (
    <Fragment>
      {pageContent?.map((page) => (
        <Fragment key={page.id}>
          {page.title && <h1>{page.title}</h1>}
          {page.text && renderText(page.text)}
        </Fragment>
      ))}
    </Fragment>
  );
};

export default Testing;
