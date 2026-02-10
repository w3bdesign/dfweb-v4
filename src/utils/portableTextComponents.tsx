import Link from "next/link";
import { Children, isValidElement } from "react";
import type { ReactNode } from "react";

import type { PortableTextMarkComponentProps } from "@portabletext/react";

/**
 * Recursively extracts plain text from React children.
 * Used to provide a string value for data-text attribute (glitch CSS effect).
 */
export function getTextFromChildren(children: ReactNode): string {
  if (children == null) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children))
    return children.map(getTextFromChildren).join("");
  if (isValidElement(children)) {
    return getTextFromChildren(
      (children.props as { children?: ReactNode }).children,
    );
  }
  return "";
}

export const myPortableTextComponents = {
  marks: {
    bold: ({ children }: PortableTextMarkComponentProps) => <b>{children}</b>,
    italic: ({ children }: PortableTextMarkComponentProps) => <i>{children}</i>,
    code: ({ children }: PortableTextMarkComponentProps) => (
      <span className="mt-4 text-lg block">{children}</span>
    ),
    link: ({ children, value }: PortableTextMarkComponentProps) => {
      const textContent = getTextFromChildren(children);
      return (
        <Link
          className="glitch underline text-lg font-bold text-green-400"
          href={value?.href || "#"}
          data-text={textContent}
        >
          {children}
        </Link>
      );
    },
  },
};
