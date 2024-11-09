"use client";

import React from "react";
import dynamic from "next/dynamic";

import Icons from "./Icons.component";
import FadeDown from "../Animations/FadeDown.component";
import FadeUp from "../Animations/FadeUp.component";
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
  }
);

type THero = { text: string };
interface IContent {
  content: THero[];
}

/**
 * Hero component for rendering the main hero section of the page
 * @param {IContent} props - The props for the Hero component
 * @param {THero[]} props.content - Array of text content for the hero section
 * @returns {JSX.Element} The rendered Hero component
 */
const Hero = ({ content }: IContent) => {
  return (
    <article
      aria-label="Kontainer for animasjoner av introtekst"
      id="main-hero"
      data-testid="main-hero"
      className="relative flex flex-col justify-center text-lg h-[26rem] md:h-[28.125rem] overflow-hidden w-full"
    >
      <MatrixCursor />
      <MobileBackground />
      <div className="hidden md:block absolute inset-0 w-full h-full">
        <ReactMatrixAnimation />
      </div>
      <div className="relative z-10">
        <section className="text-left md:text-center px-4 md:px-0">
          <FadeDown delay={0.5}>
            <h1 
              data-cy="hei"
              className="text-6xl font-bold text-[#00ff62] text-center  "
            >
              {content.length > 0 ? content[0].text : "Hei!"}
            </h1>
          </FadeDown>
          
          <FadeUp delay={0.9} cssClass="mt-4">
            <h2 className="text-2xl text-slate-300 text-left md:text-center  ">
              {content.length > 0 && content[1].text}
            </h2>
          </FadeUp>
          
          <FadeDown delay={1.4} cssClass="mt-4">
            <p className="text-xl text-slate-300 text-left md:text-center ">
              {content.length > 0 && content[2].text}
            </p>
          </FadeDown>

          <div className="mt-4">
            <Icons />
          </div>
        </section>
      </div>
    </article>
  );
};

export default Hero;
