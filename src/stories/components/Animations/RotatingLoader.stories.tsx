import React from "react";
import { Meta, Story } from "@ladle/react";
import RotatingLoader from "@/components/Animations/RotatingLoader.component";

export default {
  title: "Animations/RotatingLoader",
  component: RotatingLoader,
} as Meta;

export const Default: Story = () => <RotatingLoader />;
