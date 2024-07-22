"use client";

import React, { Suspense } from "react";
import Icons from "./Icons.component";
import FadeDown from "@/components/Animations/FadeDown.component";
import FadeUp from "@/components/Animations/FadeUp.component";
import RotatingLoader from "../Animations/RotatingLoader.component";
import dynamic from "next/dynamic";

const ReactMatrixAnimation = dynamic(
  () => import("../Animations/Matrix.component"),
  { ssr: false },
);

type THero = { text: string };
interface IContent {
  content: THero[];
}

const Hero = ({ content }: IContent) => (
  <div
    role="article"
    aria-label="Kontainer for animasjoner av introtekst"
    id="main-hero"
    data-testid="main-hero"
    className="relative flex flex-col justify-center text-lg h-[26rem] md:h-[28.125rem] overflow-hidden w-full"
  >
    <div
      className="absolute inset-0 md:hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/mobilbg.jpg')",
        top: "-0.5rem",
        marginBottom: "2.5rem",
      }}
    />
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
              <h2
                data-cy="hei"
                className="introtekst inline-block text-5xl text-slate-300"
              >
                {content.length > 0 ? content[0].text : "Hei!"}
              </h2>
            </FadeDown>
            <FadeUp
              delay={0.9}
              cssClass="mt-4 px-6 text-lg md:mx-auto md:p-0 md:text-center md:text-xl lg:w-2/3 lg:p-0 lg:text-center lg:text-xl xl:p-0 xl:text-center xl:text-2xl text-slate-300"
            >
              <h1>{content.length > 0 && content[1].text}</h1>
            </FadeUp>
            <FadeDown
              delay={1.4}
              cssClass="mt-4 px-6 text-lg md:mx-auto md:p-0 md:text-center md:text-xl lg:w-2/3 lg:p-0 lg:text-center lg:text-xl xl:p-0 xl:text-center xl:text-2xl text-slate-300"
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
