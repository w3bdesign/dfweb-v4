"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

import Icons from "./Icons.component";
import FadeDown from "@/components/Animations/FadeDown.component";
import FadeUp from "@/components/Animations/FadeUp.component";
import RotatingLoader from "@/components/Animations/RotatingLoader.component";
import MobileBackground from "./MobileBackground.component";

const ReactMatrixAnimation = dynamic(
  () => import("../Animations/Matrix.component"),
  { ssr: false },
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
const Hero = ({ content }: IContent) => (
  <article
    aria-label="Kontainer for animasjoner av introtekst"
    id="main-hero"
    data-testid="main-hero"
    className="relative flex flex-col justify-center text-lg h-[26rem] md:h-[28.125rem] overflow-hidden w-full"
  >
    <MobileBackground />
    <div className="hidden md:block absolute inset-0 w-full h-full">
      <Suspense
        fallback={
          <div className="text-center">
            <RotatingLoader />
          </div>
        }
      >
        <ReactMatrixAnimation />
      </Suspense>
    </div>
    <FadeDown delay={0.1}>
      <div className="relative z-10 mt-12 md:mb-4 p-2 md:mt-4 lg:mt-4 xl:mt-4 mb-14 md:mb-6">
        <div className="rounded">
          <section>
            <FadeDown delay={0.5} cssClass="text-center">
              <h1
                data-cy="hei"
                className="introtekst inline-block text-5xl text-slate-300"
              >
                {content.length > 0 ? content[0].text : "Hei!"}
              </h1>
            </FadeDown>
            <FadeUp
              delay={0.9}
              cssClass="mt-4 px-6 text-lg md:mx-auto md:p-0 md:text-center md:text-xl lg:w-2/3 lg:p-0 lg:text-center lg:text-xl xl:p-0 xl:text-center xl:text-2xl text-slate-300"
            >
              <h2>{content.length > 0 && content[1].text}</h2>
            </FadeUp>
            <FadeDown
              delay={1.4}
              cssClass="mt-4 px-6 text-lg md:mx-auto md:p-0 md:text-center md:text-xl lg:w-2/3 lg:p-0 lg:text-center lg:text-xl xl:p-0 xl:text-center xl:text-2xl text-slate-300"
            >
              <p>{content.length > 0 && content[2].text}</p>
            </FadeDown>
            <Icons />
          </section>
        </div>
      </div>
    </FadeDown>
  </article>
);

export default Hero;
