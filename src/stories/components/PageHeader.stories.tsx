import React from "react";
import { Meta } from "@ladle/react";
import PageHeader from "../../components/UI/PageHeader.component";
import "@/app/globals.css";

export default {
  title: "UI/PageHeader",
  component: PageHeader,
} as Meta;

// Default header with text
export const Default = () => <PageHeader>Welcome to the Page</PageHeader>;

// With HTML elements
export const WithHtmlElements = () => (
  <PageHeader>
    Welcome to <span className="text-matrix-light">Matrix</span>
  </PageHeader>
);

// Long text
export const LongText = () => (
  <PageHeader>
    This is a very long page header text that demonstrates how the component
    handles longer content
  </PageHeader>
);

// Short text
export const ShortText = () => <PageHeader>Projects</PageHeader>;

// Narrow viewport
export const NarrowViewport = () => (
  <div style={{ width: "320px" }}>
    <PageHeader>Mobile View Header</PageHeader>
  </div>
);

// Wide viewport
export const WideViewport = () => (
  <div style={{ width: "1200px" }}>
    <PageHeader>Desktop View Header</PageHeader>
  </div>
);
