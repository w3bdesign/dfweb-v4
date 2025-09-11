import React from "react";
import { Meta, Story } from "@ladle/react";
import SkipLink from "@/components/UI/SkipLink.component";

export default {
  title: "UI/SkipLink",
  component: SkipLink,
} as Meta;

export const Default: Story = () => <SkipLink />;

// Story showing the skip link in context
export const WithContext = () => (
  <div>
    <SkipLink />
    <header className="bg-gray-800 p-4 text-white">
      <nav>Navigation Content</nav>
    </header>
    <div id="main-content" className="p-4">
      <h1>Main Content</h1>
      <p>This story demonstrates the SkipLink in context with a page layout.</p>
      <p>
        Tab to focus on the SkipLink - it will appear at the top of the page.
      </p>
    </div>
  </div>
);

// Story with focus styles visible
export const Focused = () => (
  <div className="p-4">
    <div className="not-sr-only absolute top-4 left-4 z-50">
      <SkipLink />
    </div>
    <p className="mt-20">
      This story shows how the SkipLink appears when focused. The skip link is
      permanently visible here for demonstration purposes.
    </p>
  </div>
);
