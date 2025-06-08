import React from "react";
import { Meta } from "@ladle/react";
import Section from "@/components/Index/Section.component";
import pagecontent from "@/__mocks__/pagecontent.json";
import type { Pagecontent } from "@/types/sanity.types";

import "@/app/globals.css";

export default {
  title: "Index/Section",
  component: Section,
} as Meta;

const mockPortableText = pagecontent[0].content[0].text as Pagecontent["text"];
const longContent = pagecontent[0].content[1].text as Pagecontent["text"];

// Default section
export const Default = () => (
  <Section _type="pagecontent" title="About Me" text={mockPortableText} />
);

// Section with alternate styling
export const Alternate = () => (
  <div className="bg-[#121c30] p-4">
    <Section
      _type="pagecontent"
      title="My Projects"
      text={mockPortableText}
      variant="alternate"
    />
  </div>
);

// Section with longer content
export const LongContent = () => (
  <Section _type="pagecontent" title="Skills & Experience" text={longContent} />
);

// Multiple sections together
export const MultipleSections = () => (
  <div>
    <Section _type="pagecontent" title="About Me" text={mockPortableText} />
    <div className="bg-[#121c30]">
      <Section
        _type="pagecontent"
        title="My Skills"
        text={longContent}
        variant="alternate"
      />
    </div>
    <Section _type="pagecontent" title="Contact" text={mockPortableText} />
  </div>
);

// Section in a narrower container
export const NarrowContainer = () => (
  <div className="max-w-xl mx-auto border border-gray-700">
    <Section
      _type="pagecontent"
      title="Narrow Section"
      text={mockPortableText}
    />
  </div>
);

// Section with debug button hidden
export const DebugButtonHidden = () => (
  <Section
    _type="pagecontent"
    title="No Debug Button"
    text={mockPortableText}
    showDebugButton={false}
  />
);

// Section with debug button explicitly shown (default behavior)
export const DebugButtonVisible = () => (
  <Section
    _type="pagecontent"
    title="Debug Button Visible"
    text={mockPortableText}
    showDebugButton={true}
  />
);
