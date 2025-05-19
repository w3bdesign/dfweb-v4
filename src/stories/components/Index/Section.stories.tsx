import React from "react";
import { Meta } from "@ladle/react";
import Section from "@/components/Index/Section.component";
import { Pagecontent } from "@/types/sanity.types";
import "@/app/globals.css";

export default {
  title: "Index/Section",
  component: Section,
} as Meta;

// Create mock Portable Text data for the text content
const mockPortableText: Pagecontent["text"] = [
  {
    _type: "block",
    _key: "paragraph1",
    style: "normal",
    children: [
      {
        _type: "span" as const,
        _key: "span1",
        text: "This is an example of a content section with Portable Text. ",
        marks: [],
      },
      {
        _type: "span" as const,
        _key: "span2",
        text: "This text can include styling like bold or italic.",
        marks: ["strong"],
      },
    ],
  },
  {
    _type: "block",
    _key: "paragraph2",
    style: "normal",
    children: [
      {
        _type: "span" as const,
        _key: "span3",
        text: "Multiple paragraphs are supported, making this component very flexible for various types of content.",
        marks: [],
      },
    ],
  },
];

// Longer content example
const longContent: Pagecontent["text"] = [
  ...mockPortableText,
  {
    _type: "block",
    _key: "paragraph3",
    style: "h3",
    children: [
      {
        _type: "span" as const,
        _key: "span4",
        text: "Features",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "paragraph4",
    style: "normal",
    children: [
      {
        _type: "span" as const,
        _key: "span5",
        text: "The section component supports a variety of content types through Portable Text. This allows for rich text formatting, links, lists, and more.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "paragraph5",
    listItem: "bullet",
    style: "normal",
    level: 1,
    children: [
      {
        _type: "span" as const,
        _key: "span6",
        text: "Responsive design that works on all devices",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "paragraph6",
    listItem: "bullet",
    style: "normal",
    level: 1,
    children: [
      {
        _type: "span" as const,
        _key: "span7",
        text: "Animation support through BounceInScroll",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "paragraph7",
    listItem: "bullet",
    style: "normal",
    level: 1,
    children: [
      {
        _type: "span" as const,
        _key: "span8",
        text: "Multiple visual variants",
        marks: [],
      },
    ],
  },
];

// Default section
export const Default = () => (
  <Section 
    _type="pagecontent"
    title="About Me" 
    text={mockPortableText}
  />
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
  <Section 
    _type="pagecontent"
    title="Skills & Experience" 
    text={longContent}
  />
);

// Multiple sections together
export const MultipleSections = () => (
  <div>
    <Section 
      _type="pagecontent"
      title="About Me" 
      text={mockPortableText}
    />
    <div className="bg-[#121c30]">
      <Section 
        _type="pagecontent"
        title="My Skills" 
        text={longContent} 
        variant="alternate"
      />
    </div>
    <Section 
      _type="pagecontent"
      title="Contact" 
      text={mockPortableText}
    />
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
