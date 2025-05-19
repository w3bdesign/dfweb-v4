import React from "react";
import { Meta, Story } from "@ladle/react";
import Pill from "@/components/UI/Pill.component";

export default {
  title: "UI/Pill",
  component: Pill,
} as Meta;

const Template: Story<React.ComponentProps<typeof Pill>> = (args) => (
  <Pill {...args} />
);

export const Default = Template.bind({});
Default.args = {
  text: "Default Pill",
};

export const CustomClass = Template.bind({});
CustomClass.args = {
  text: "Custom Styled Pill",
  className: "bg-purple-600 bg-opacity-20 border-purple-800",
};

export const AsLink = Template.bind({});
AsLink.args = {
  text: "Link Pill",
  href: "https://example.com",
};

export const WithClickHandler = Template.bind({});
WithClickHandler.args = {
  text: "Clickable Pill",
  onClick: () => alert("Pill clicked!"),
};
