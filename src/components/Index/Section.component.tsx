"use client";

import { PortableText } from "@portabletext/react";
import { useState } from "react";
import BounceInScroll from "../Animations/BounceInScroll.component";
import Button from "../UI/Button.component";
import { myPortableTextComponents } from "@/utils/portableTextComponents";
import type { Pagecontent } from "@/types/sanity.types";

interface SectionProps extends Pagecontent {
  variant?: "default" | "alternate";
}

/**
 * Section component that renders a single content section
 * @param {SectionProps} props - The props for the Section component
 * @param {Pagecontent['text']} props.text - The text content from Sanity
 * @param {string} props.title - The title of the section
 * @param {"default" | "alternate"} [props.variant="default"] - Visual style variant of the section. Controls background color.
 * @returns {JSX.Element | null} The rendered Section component or null if invalid data
 */
const Section = ({ text, title, variant = "default" }: SectionProps) => {
  const [shouldError, setShouldError] = useState(false);

  if (!title || !text) {
    console.error(
      `Ugyldig seksjon data: tittel=${title}, tekst=${JSON.stringify(text)}`
    );
    return null;
  }

  if (shouldError) {
    throw new Error("En uventet feil har oppstått");
  }

  const sectionStyles = {
    default: "bg-slate-900",
    alternate: "bg-slate-800/30",
  };

  return (
    <section
      aria-label={title}
      data-testid="sanity-section"
      className={`
        md:py-6 
        relative
        transition-colors
        duration-300
        ${sectionStyles[variant]}
      `}
    >
      <div className="p-6 text-lg h-full max-w-7xl mx-auto">
        <BounceInScroll viewAmount={0}>
          <h2
            data-testid="sanity-title"
            data-cy={title}
            className="text-3xl text-center text-slate-100"
          >
            {title}
          </h2>
          <div className="flex justify-center">
            <div className="mt-4 text-lg text-left md:max-w-3xl text-slate-300/[0.9]">
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
