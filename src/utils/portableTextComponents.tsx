import Link from "next/link";

import type { PortableTextMarkComponentProps } from "@portabletext/react";

export const myPortableTextComponents = {
  marks: {
    bold: ({ children }: PortableTextMarkComponentProps) => <b>{children}</b>,
    italic: ({ children }: PortableTextMarkComponentProps) => <i>{children}</i>,
    code: ({ children }: PortableTextMarkComponentProps) => (
      <span className="mt-4 text-lg block">{children}</span>
    ),
    link: ({ text, value }: PortableTextMarkComponentProps) => (
      <Link
        className="glitch underline text-lg font-bold text-green-400"
        href={value?.href || "#"}
        data-text={text}
      >
        {text}
      </Link>
    ),
  },
};
