import React from "react";
import { Meta, Story } from "@ladle/react";
import RotatingLoader from "../../components/Animations/RotatingLoader.component";

export default {
  title: "RotatingLoader",
  component: RotatingLoader,
} as Meta;

const Template: Story = () => <RotatingLoader />;

export const Default = Template.bind({});
