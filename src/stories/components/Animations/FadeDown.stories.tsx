import React from "react";
import { Meta, Story } from "@ladle/react";
import FadeDown from "@/components/Animations/FadeDown.component";
import { IAnimateWithDelayProps } from "@/components/Animations/types/Animations.types";

export default {
  title: "Animations/FadeDown",
  component: FadeDown,
} as Meta;

export const Default: Story<IAnimateWithDelayProps> = () => (
  <FadeDown
    delay={0}
    cssClass="p-4 bg-gray-100 border border-gray-300 rounded-sm text-neutral-800"
  >
    Fade Down Animation
  </FadeDown>
);

export const WithDelay: Story<IAnimateWithDelayProps> = () => (
  <FadeDown
    delay={1}
    cssClass="p-4 bg-blue-100 border border-blue-300 rounded-sm text-neutral-800"
  >
    Fade Down with Delay
  </FadeDown>
);

export const CustomStyles: Story<IAnimateWithDelayProps> = () => (
  <FadeDown
    delay={0.5}
    cssClass="p-4 bg-green-100 border border-green-300 rounded-sm shadow-lg text-neutral-800"
  >
    Fade Down with Custom Styles
  </FadeDown>
);
