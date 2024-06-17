"use client";

import React, { Suspense } from "react";

import Icons from "./Icons.component";

import FadeDown from "@/components/Animations/FadeDown.component";
import FadeUp from "@/components/Animations/FadeUp.component";

const ReactMatrixAnimation = React.lazy(
  () => import("../Animations/Matrix.component"),
);

type THero = { text: string };

interface IContent {
  content: THero[];
}

/**
 * Renders Hero that is used on the front page
 * Uses Framer Motion for animations to show the text
 * @function Hero
 * @returns {JSX.Element} - Rendered component
 */

const Hero = ({ content }: IContent) => (
  <div
    role="article"
    aria-label="Kontainer for animasjoner av introtekst"
    id="main-hero"
    data-testid="main-hero"
    className="relative flex flex-col justify-center text-lg h-[33rem] md:h-[28.125rem] overflow-hidden"
  >
    <Suspense
      fallback={<div className="text-center">Loading animation...</div>}
    >
      <ReactMatrixAnimation />
    </Suspense>
    <FadeDown delay={0.1}>
      <div className="relative z-10 mt-10 mb-12 md:mb-4 bg-white p-2 opacity-90 md:mt-4 lg:mt-4 xl:mt-4">
        <div className="rounded text-black">
          <section>
            <FadeDown delay={0.5} cssClass="text-center">
              <span data-cy="hei" className="introtekst inline-block text-5xl">
                {content.length > 0 ? content[0].text : "Hei!"}
              </span>
            </FadeDown>
            <FadeUp
              delay={0.9}
              cssClass="mt-4 px-6 text-lg md:mx-auto md:p-0 md:text-center md:text-xl lg:w-2/3 lg:p-0 lg:text-center lg:text-xl xl:p-0 xl:text-center xl:text-2xl"
            >
              <h1>{content.length > 0 && content[1].text}</h1>
            </FadeUp>
            <FadeDown
              delay={1.4}
              cssClass="mt-4 px-6 text-lg md:mx-auto md:p-0 md:text-center md:text-xl lg:w-2/3 lg:p-0 lg:text-center lg:text-xl xl:p-0 xl:text-center xl:text-2xl"
            >
              <h2>{content.length > 0 && content[2].text}</h2>
            </FadeDown>
            <Icons />
          </section>
        </div>
      </div>
    </FadeDown>
  </div>
);

export default Hero;
