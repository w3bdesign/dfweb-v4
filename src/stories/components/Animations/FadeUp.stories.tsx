import React from "react";
import { Meta, Story } from "@ladle/react";
import FadeUp from "@/components/Animations/FadeUp.component";
import { IAnimateWithDelayProps } from "@/components/Animations/types/Animations.types";

export default {
  title: "Animations/FadeUp",
  component: FadeUp,
} as Meta;

export const Default: Story<IAnimateWithDelayProps> = () => (
  <FadeUp
    delay={0}
    cssClass="p-4 bg-gray-100 border border-gray-300 rounded-sm text-neutral-800"
  >
    Fade Up Animation
  </FadeUp>
);

export const WithDelay: Story<IAnimateWithDelayProps> = () => (
  <FadeUp
    delay={1}
    cssClass="p-4 bg-blue-100 border border-blue-300 rounded-sm text-neutral-800"
  >
    Fade Up with Delay
  </FadeUp>
);

export const CustomStyles: Story<IAnimateWithDelayProps> = () => (
  <FadeUp
    delay={0.5}
    cssClass="p-4 bg-green-100 border border-green-300 rounded-sm shadow-lg text-neutral-800"
  >
    Fade Up with Custom Styles
  </FadeUp>
);
