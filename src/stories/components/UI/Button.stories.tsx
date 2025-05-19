import React from "react";
import { Meta, Story } from "@ladle/react";
import Button, { IButtonProps } from "@/components/UI/Button.component";

export default {
  title: "UI/Button",
  component: Button,
} as Meta;

const Template: Story<IButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Default Button",
};

export const LinkButton = Template.bind({});
LinkButton.args = {
  children: "Link Button",
  href: "https://example.com",
  renderAs: "a",
};

export const SubmitButton = Template.bind({});
SubmitButton.args = {
  children: "Submit Button",
  type: "submit",
};

export const ResetButton = Template.bind({});
ResetButton.args = {
  children: "Reset Button",
  type: "reset",
};

export const DisabledButton = Template.bind({});
DisabledButton.args = {
  children: "Disabled Button",
  disabled: true,
};

export const CustomElementButton = Template.bind({});
CustomElementButton.args = {
  children: "Custom Element Button",
  renderAs: "div",
};
