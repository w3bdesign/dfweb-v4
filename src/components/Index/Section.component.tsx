"use client";

import { PortableText } from "@portabletext/react";
import { useState } from "react";
import FadeInScroll from "../Animations/FadeInScroll.component";
import Button from "../UI/Button.component";
import { myPortableTextComponents } from "@/utils/portableTextComponents";
import type { Pagecontent } from "@/types/sanity.types";

interface SectionProps extends Pagecontent {
  variant?: "default" | "alternate";
  showDebugButton?: boolean;
  viewAmount?: number;
}

/**
 * Section component that renders a single content section
 * @param {SectionProps} props - The props for the Section component
 * @param {Pagecontent['text']} props.text - The text content from Sanity
 * @param {string} props.title - The title of the section
 * @param {"default" | "alternate"} [props.variant="default"] - Visual style variant of the section. Controls background color.
 * @param {boolean} [props.showDebugButton=true] - If true (default), shows the debug button in development mode. Set to false to hide the button (e.g., in stories or production).
 * @param {number} [props.viewAmount=0.2] - The viewport amount (0-1) required to trigger the fade-in animation. Lower values trigger earlier.
 * @returns {JSX.Element | null} The rendered Section component or null if invalid data
 */
const Section = ({
  text,
  title,
  variant = "default",
  showDebugButton = true,
  viewAmount = 0.2,
}: SectionProps) => {
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
        contain-layout
        ${sectionStyles[variant]}
      `}
    >
      <div className="p-6 md:p-2 text-lg h-full max-w-7xl mx-auto">
        <FadeInScroll viewAmount={viewAmount} data-testid="fade-in-scroll">
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
          {process.env.NODE_ENV === "development" && showDebugButton && (
            <Button onClick={() => setShouldError(true)} type="button">
              Utløs Testfeil
            </Button>
          )}
        </FadeInScroll>
      </div>
    </section>
  );
};

export default Section;
