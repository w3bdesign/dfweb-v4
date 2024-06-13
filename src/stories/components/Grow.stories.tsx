import React from "react";
import { Meta, Story } from "@ladle/react";
import Grow from "../../components/Animations/Grow.component";
import { IGrowProps } from "../../components/Animations/types/Animations.types";

export default {
  title: "Grow",
  component: Grow,
} as Meta;

const Template: Story<IGrowProps> = (args) => <Grow {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Grow Animation",
  duration: 0.5,
  delay: 0,
  easing: [0.42, 0, 0.58, 1],
};

export const WithDelay = Template.bind({});
WithDelay.args = {
  children: "Grow with Delay",
  duration: 0.5,
  delay: 1,
  easing: [0.42, 0, 0.58, 1],
};

export const CustomDuration = Template.bind({});
CustomDuration.args = {
  children: "Grow with Custom Duration",
  duration: 1,
  delay: 0,
  easing: [0.42, 0, 0.58, 1],
};

export const CustomEasing = Template.bind({});
CustomEasing.args = {
  children: "Grow with Custom Easing",
  duration: 0.5,
  delay: 0,
  easing: [0.25, 0.8, 0.25, 1],
};
