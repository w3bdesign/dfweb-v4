import React from "react";
import { Pagecontent } from "@/types/sanity.types";

/**
 * This is a simplified mock of @portabletext/react for Ladle stories
 * NOTE: This is for TESTING / STORYBOOK use only
 */

// Mock the PortableText component to render text for stories
export const PortableText = ({
  value,
}: {
  value: Pagecontent["text"];
  components?: Record<string, unknown>;
}) => {
  // For simplicity, we'll just render the text content of each block
  return React.createElement(
    React.Fragment,
    null,
    value?.map((block) => {
      if (block._type === "block") {
        // Handle different block styles
        const Element = getElementForStyle(block.style || "normal");

        // Get the text content from children
        const textContent = block.children
          ?.map((child) => {
            if (child._type === "span") {
              // Handle marks if present
              if (child.marks?.includes("strong")) {
                return React.createElement(
                  "strong",
                  { key: child._key },
                  child.text
                );
              }
              if (child.marks?.includes("em")) {
                return React.createElement(
                  "em",
                  { key: child._key },
                  child.text
                );
              }
              return child.text;
            }
            return null;
          })
          .join("");

        // If it's a list item, handle differently
        if (block.listItem === "bullet") {
          return React.createElement("li", { key: block._key }, textContent);
        }

        // Regular block (paragraph, heading, etc.)
        return React.createElement(Element, { key: block._key }, textContent);
      }
      return null;
    })
  );
};

// Helper function to get the appropriate HTML element for a style
function getElementForStyle(style: string) {
  switch (style) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    case "blockquote":
      return "blockquote";
    case "normal":
    default:
      return "p";
  }
}
