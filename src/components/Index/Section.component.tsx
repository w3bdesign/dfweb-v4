"use client";

import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextMarkComponentProps } from "@portabletext/react";
import BounceInScroll from "../Animations/BounceInScroll.component";
import Button from "../UI/Button.component";
import { useState } from "react";
import { IContent } from "./types";
import { myPortableTextComponents } from "../../utils/portableTextComponents";

/**
 * Section component that renders a single content section
 * @param {IContent} props - The props for the Section component
 * @param {string} props.text - The text content of the section
 * @param {string} props.title - The title of the section
 * @returns {JSX.Element | null} The rendered Section component or null if invalid data
 */
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

export default Section;