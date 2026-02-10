/**
 * Jest mock for @portabletext/react
 *
 * Implements the PortableText component's marks rendering pipeline
 * per the documented API at https://github.com/portabletext/react-portabletext
 *
 * Marks contract (from README):
 * - Decorators (bold, italic, code): marks[] entry IS the component key
 *   → components.marks[markName]({ children, markType })
 * - Annotations (link): marks[] entry references markDefs[]._key
 *   → components.marks[markDef._type]({ children, value: markDef, markType })
 */
import React from "react";
import type { ReactNode } from "react";

interface PortableTextSpan {
  _key: string;
  _type: string;
  marks?: string[];
  text?: string;
}

interface PortableTextMarkDefinition {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

interface PortableTextBlock {
  _key: string;
  _type: string;
  children?: PortableTextSpan[];
  markDefs?: PortableTextMarkDefinition[];
  style?: string;
}

interface MarkComponentProps {
  children?: ReactNode;
  value?: Record<string, unknown>;
  markType?: string;
}

interface PortableTextComponents {
  marks?: Record<
    string,
    React.ComponentType<MarkComponentProps>
  >;
}

interface PortableTextProps {
  value: PortableTextBlock[];
  components?: PortableTextComponents;
  onMissingComponent?: false | ((message: string, options: Record<string, unknown>) => void);
}

export function PortableText({ value, components }: PortableTextProps) {
  if (!value || !Array.isArray(value)) return null;

  return (
    <>
      {value.map((block) => {
        if (block._type !== "block" || !block.children) return null;

        return (
          <p key={block._key}>
            {block.children.map((child) => {
              if (child._type !== "span") return null;

              let content: ReactNode = child.text;

              if (child.marks && components?.marks) {
                for (const mark of child.marks) {
                  const markDef = block.markDefs?.find(
                    (md) => md._key === mark,
                  );

                  // Annotation: mark references a markDef by _key
                  // Decorator: mark string IS the component key
                  const markType = markDef?._type ?? mark;
                  const MarkComponent = components.marks[markType];

                  if (MarkComponent) {
                    content = (
                      <MarkComponent
                        value={markDef}
                        markType={markType}
                      >
                        {content}
                      </MarkComponent>
                    );
                  }
                }
              }

              return (
                <React.Fragment key={child._key}>{content}</React.Fragment>
              );
            })}
          </p>
        );
      })}
    </>
  );
}

/** Extract plain text from Portable Text blocks */
export function toPlainText(
  blocks: PortableTextBlock | PortableTextBlock[],
): string {
  const blockArray = Array.isArray(blocks) ? blocks : [blocks];
  return blockArray
    .map((block) =>
      block.children
        ? block.children
            .filter((child) => child._type === "span")
            .map((span) => span.text ?? "")
            .join("")
        : "",
    )
    .join("\n\n");
}

// Type re-exports (compile-time only, stripped at runtime)
export type { MarkComponentProps as PortableTextMarkComponentProps };
export type { PortableTextComponents as PortableTextReactComponents };
