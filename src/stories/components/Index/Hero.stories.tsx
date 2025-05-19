import React from "react";
import { Meta } from "@ladle/react";
import Hero from "@/components/Index/Hero.component";
import type { Herocontent } from "@/types/sanity.types";
import "@/app/globals.css";

export default {
  title: "Index/Hero",
  component: Hero,
} as Meta;

// Mock hero content data
const mockHeroContent: Herocontent[] = [
  {
    _type: "herocontent",
    text: "Hei!",
  },
  {
    _type: "herocontent",
    text: "Jeg er en frontend-utvikler med fokus på React og TypeScript",
  },
  {
    _type: "herocontent",
    text: "Velkommen til min portfolio-side der du kan se mine prosjekter og lære mer om min erfaring",
  },
];

// Default hero component with mock content
export const Default = () => <Hero content={mockHeroContent} />;

// Hero with minimal content
export const MinimalContent = () => (
  <Hero
    content={[
      {
        _type: "herocontent",
        text: "Hello World",
      },
    ]}
  />
);

// Hero with longer content
export const LongContent = () => (
  <Hero
    content={[
      {
        _type: "herocontent",
        text: "Frontend Developer",
      },
      {
        _type: "herocontent",
        text: "Specialized in creating modern, responsive web applications with React, Next.js, and TypeScript",
      },
      {
        _type: "herocontent",
        text: "With over 5 years of experience in web development, I focus on building accessible, performant, and visually appealing user interfaces that provide excellent user experiences across all devices and platforms.",
      },
    ]}
  />
);

// Hero with no content (fallbacks should kick in)
export const NoContent = () => <Hero content={[]} />;

// Add a wrapper div to constrain the hero size for the story
const StoryContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-screen-xl mx-auto">{children}</div>
);

// Hero in a container to demonstrate responsiveness
export const InContainer = () => (
  <StoryContainer>
    <Hero content={mockHeroContent} />
  </StoryContainer>
);
