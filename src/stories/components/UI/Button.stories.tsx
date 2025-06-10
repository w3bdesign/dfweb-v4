import React from "react";
import { Meta } from "@ladle/react";
import Button from "@/components/UI/Button.component";
import "@/app/globals.css";

export default {
  title: "UI/Button",
  component: Button,
} as Meta;

// Default button
export const Default = () => <Button>Default Button</Button>;

// Link button
export const LinkButton = () => (
  <Button href="https://example.com" renderAs="a">
    Link Button
  </Button>
);

// Submit button
export const SubmitButton = () => <Button type="submit">Submit Button</Button>;

// Reset button
export const ResetButton = () => <Button type="reset">Reset Button</Button>;

// Disabled button
export const DisabledButton = () => <Button disabled>Disabled Button</Button>;

// Custom element button
export const CustomElementButton = () => (
  <Button renderAs="div">Custom Element Button</Button>
);

// Button group
export const ButtonGroup = () => (
  <div className="flex flex-col items-start gap-4">
    <Button>Small Button</Button>
    <Button>Regular Button</Button>
    <Button>Large Button</Button>
  </div>
);

// Button with icon
export const ButtonWithIcon = () => (
  <Button>
    <span className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
      </svg>
      Button with Icon
    </span>
  </Button>
);
