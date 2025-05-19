import React from "react";
import { Pagecontent } from "@/types/sanity.types";

// Mock the PortableText component to render text for stories
export const PortableText = ({
  value,
}: {
  value: Pagecontent["text"];
  components?: Record<string, unknown>;
}) => {
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
function getElementForStyle(style: string): string {
  const styleToElementMap: Record<string, string> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    blockquote: "blockquote",
    normal: "p",
  };
  return styleToElementMap[style] || "p"; // Default to 'p' if style is not found
}
