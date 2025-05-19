import React from "react";
import { Meta, Story } from "@ladle/react";
import Grow from "@/components/Animations/Grow.component";
import { IGrowProps } from "@/components/Animations/types/Animations.types";

export default {
  title: "Animations/Grow",
  component: Grow,
} as Meta;

export const Default: Story<IGrowProps> = () => (
  <div className="p-4 bg-gray-100 text-neutral-800 rounded-sm border border-gray-300">
    <Grow duration={0.5} delay={0} easing={[0.42, 0, 0.58, 1]}>
      Grow Animation
    </Grow>
  </div>
);

export const WithDelay: Story<IGrowProps> = () => (
  <div className="p-4 bg-gray-100 text-neutral-800 rounded-sm border border-gray-300">
    <Grow duration={0.5} delay={1} easing={[0.42, 0, 0.58, 1]}>
      Grow with Delay
    </Grow>
  </div>
);

export const CustomDuration: Story<IGrowProps> = () => (
  <div className="p-4 bg-gray-100 text-neutral-800 rounded-sm border border-gray-300">
    <Grow duration={1} delay={0} easing={[0.42, 0, 0.58, 1]}>
      Grow with Custom Duration
    </Grow>
  </div>
);

export const CustomEasing: Story<IGrowProps> = () => (
  <div className="p-4 bg-gray-100 text-neutral-800 rounded-sm border border-gray-300">
    <Grow duration={0.5} delay={0} easing={[0.25, 0.8, 0.25, 1]}>
      Grow with Custom Easing
    </Grow>
  </div>
);
