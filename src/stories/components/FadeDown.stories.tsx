import React from "react";
import { Meta, Story } from "@ladle/react";
import FadeDown from "../../components/Animations/FadeDown.component";
import { IAnimateWithDelayProps } from "../../components/Animations/types/Animations.types";

export default {
  title: "FadeDown",
  component: FadeDown,
} as Meta;

const Template: Story<IAnimateWithDelayProps> = (args) => (
  <FadeDown {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: "Fade Down Animation",
  cssClass: "p-4 bg-gray-100 border border-gray-300 rounded-sm",
  delay: 0,
};

export const WithDelay = Template.bind({});
WithDelay.args = {
  children: "Fade Down with Delay",
  cssClass: "p-4 bg-blue-100 border border-blue-300 rounded-sm",
  delay: 1,
};

export const CustomStyles = Template.bind({});
CustomStyles.args = {
  children: "Fade Down with Custom Styles",
  cssClass: "p-4 bg-green-100 border border-green-300 rounded-sm shadow-lg",
  delay: 0.5,
};
