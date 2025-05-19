import React from "react";
import { Meta } from "@ladle/react";
import PageHeader from "@/components/UI/PageHeader.component";
import "@/app/globals.css";

export default {
  title: "UI/PageHeader",
  component: PageHeader,
} as Meta;

// Default page header with text
export const Default = () => <PageHeader>Page Title</PageHeader>;

// With longer text
export const LongTitle = () => (
  <PageHeader>A Much Longer Page Title That Might Wrap on Mobile</PageHeader>
);

// With emoji
export const WithEmoji = () => <PageHeader>📝 Contact Page</PageHeader>;

// With HTML content
export const WithHTMLContent = () => (
  <PageHeader>
    <span className="flex items-center justify-center gap-2">
      <span aria-label="projects icon">🚀</span>
      <span>My Projects</span>
      <span className="text-sm bg-green-600 px-2 py-1 rounded-full ml-2">
        New
      </span>
    </span>
  </PageHeader>
);

// Showing different container widths
export const ContainerSizes = () => (
  <div className="space-y-8">
    <div className="w-full max-w-7xl mx-auto border border-dashed border-gray-500 p-2">
      <p className="text-white text-center mb-2">Full width container</p>
      <PageHeader>Full Width</PageHeader>
    </div>

    <div className="w-full max-w-3xl mx-auto border border-dashed border-gray-500 p-2">
      <p className="text-white text-center mb-2">Medium width container</p>
      <PageHeader>Medium Width</PageHeader>
    </div>

    <div className="w-full max-w-sm mx-auto border border-dashed border-gray-500 p-2">
      <p className="text-white text-center mb-2">Small width container</p>
      <PageHeader>Small Width</PageHeader>
    </div>
  </div>
);
