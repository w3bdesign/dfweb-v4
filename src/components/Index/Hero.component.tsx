"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import type { Herocontent } from "@/types/sanity.types";

import Icons from "./Icons.component";
import FadeIn from "../Animations/FadeIn.component";
import RotatingLoader from "../Animations/RotatingLoader.component";
import MobileBackground from "./MobileBackground.component";
import MatrixCursor from "../Animations/MatrixCursor.component";

const ReactMatrixAnimation = dynamic(
  () => import("../Animations/Matrix.component"),
  {
    ssr: false,
    loading: () => (
      <div className="text-center">
        <RotatingLoader />
      </div>
    ),
  },
);

/**
 * Hero component for rendering the main hero section of the page
 * @param {Object} props - The props for the Hero component
 * @param {Herocontent[]} props.content - Array of hero content from Sanity
 * @returns {JSX.Element} The rendered Hero component
 */
const Hero = ({ content }: { content: Herocontent[] }) => {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <article
      aria-label="Kontainer for animasjoner av introtekst"
      id="main-hero"
      data-testid="main-hero"
      ref={heroRef}
      className="relative flex flex-col justify-center text-lg h-[32rem] md:h-[30rem] overflow-hidden w-full"
    >
      <MatrixCursor heroRef={heroRef} />
      <MobileBackground />
      <div className="hidden md:block absolute inset-0 w-full h-full">
        <ReactMatrixAnimation />
      </div>
      <div className="relative z-10">
        <section
          className="text-left md:text-center px-4 md:px-0"
          data-testid="fade-in"
        >
          <FadeIn delay={0.2}>
            <h1
              data-cy="hei"
              className="text-6xl font-bold text-[#00ff62] text-center"
            >
              {content?.length > 0 ? content[0]?.text : "Hei!"}
            </h1>
          </FadeIn>

          <FadeIn delay={1}>
            <h2 className="mt-4 text-2xl text-slate-300 text-left md:text-center  ">
              {content?.length > 0 && content[1]?.text}
            </h2>
          </FadeIn>

          <FadeIn delay={2}>
            <p className="mt-4 text-xl text-slate-300 text-left md:text-center ">
              {content?.length > 0 && content[2]?.text}
            </p>
          </FadeIn>

          <div className="mt-4">
            <Icons />
          </div>
        </section>
      </div>
    </article>
  );
};

export default Hero;
