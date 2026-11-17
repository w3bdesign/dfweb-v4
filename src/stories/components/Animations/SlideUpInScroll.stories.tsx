import React from "react";
import { Meta, Story } from "@ladle/react";
import BounceInScroll from "@/components/Animations/BounceInScroll.component";
import { IAnimateBounceProps } from "@/components/Animations/types/Animations.types";

export default {
  title: "Animations/BounceInScroll",
  component: BounceInScroll,
} as Meta;

const Card = () => (
  <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl text-white mb-4">Animated Card</h2>
    <p className="text-gray-300">
      This card demonstrates the BounceInScroll animation component.
    </p>
  </div>
);

const storyWrapper = (storyArgs: IAnimateBounceProps) => (
  <div className="min-h-[150vh] bg-gray-800 p-8">
    <div className="text-white mb-[100vh]">
      ⬇️ Scroll down to see the animation
    </div>
    <BounceInScroll {...storyArgs} />
  </div>
);

export const Default: Story<IAnimateBounceProps> = () =>
  storyWrapper({
    children: <Card />,
    viewAmount: 0.2,
  });

export const InstantAnimation: Story<IAnimateBounceProps> = () =>
  storyWrapper({
    children: <Card />,
    instant: true,
  });

export const FullViewTrigger: Story<IAnimateBounceProps> = () =>
  storyWrapper({
    children: <Card />,
    viewAmount: "all",
  });

export const PartialViewTrigger: Story<IAnimateBounceProps> = () =>
  storyWrapper({
    children: <Card />,
    viewAmount: "some",
  });

export const CustomViewAmount: Story<IAnimateBounceProps> = () =>
  storyWrapper({
    children: <Card />,
    viewAmount: 0.5,
  });

export const WithCustomClass: Story<IAnimateBounceProps> = () =>
  storyWrapper({
    children: <Card />,
    cssClass: "max-w-md mx-auto",
  });

export const LargeContent: Story<IAnimateBounceProps> = () =>
  storyWrapper({
    children: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card />
        <Card />
        <Card />
      </div>
    ),
    viewAmount: 0.2,
  });

export const TextContent: Story<IAnimateBounceProps> = () =>
  storyWrapper({
    children: (
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome</h1>
        <p className="text-xl">This is a simple text animation example.</p>
      </div>
    ),
    viewAmount: 0.2,
  });
