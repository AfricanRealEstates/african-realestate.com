"use client";
import { useMemo } from "react";
import Image from "next/image";
import type { JSX } from "react/jsx-runtime";

interface GuideContentProps {
  content: any;
}

export default function GuideContent({ content }: GuideContentProps) {
  const renderedContent = useMemo(() => {
    if (!content || typeof content !== "object") {
      return (
        <div className="text-gray-600 leading-relaxed">
          <p>
            This guide provides comprehensive information about property
            transactions in Africa.
          </p>
        </div>
      );
    }

    // Handle ProseMirror/TipTap JSON format
    if (
      content.type === "doc" &&
      content.content &&
      Array.isArray(content.content)
    ) {
      return (
        <div className="space-y-6">
          {content.content.map((node: any, index: number) => {
            switch (node.type) {
              case "paragraph":
                if (!node.content || node.content.length === 0) {
                  return <div key={index} className="h-4" />; // Empty paragraph spacing
                }
                return (
                  <p
                    key={index}
                    className="text-gray-700 leading-relaxed text-lg"
                  >
                    {node.content.map((textNode: any, textIndex: number) => {
                      if (textNode.type === "text") {
                        const text = textNode.text;
                        if (textNode.marks) {
                          textNode.marks.forEach((mark: any) => {
                            if (mark.type === "bold") {
                              return (
                                <strong
                                  key={textIndex}
                                  className="font-semibold text-gray-900"
                                >
                                  {text}
                                </strong>
                              );
                            }
                            if (mark.type === "italic") {
                              return (
                                <em key={textIndex} className="italic">
                                  {text}
                                </em>
                              );
                            }
                          });
                          // Return formatted text
                          if (
                            textNode.marks.some(
                              (mark: any) => mark.type === "bold"
                            )
                          ) {
                            return (
                              <strong
                                key={textIndex}
                                className="font-semibold text-gray-900"
                              >
                                {text}
                              </strong>
                            );
                          }
                          if (
                            textNode.marks.some(
                              (mark: any) => mark.type === "italic"
                            )
                          ) {
                            return (
                              <em key={textIndex} className="italic">
                                {text}
                              </em>
                            );
                          }
                        }
                        return text;
                      }
                      return null;
                    })}
                  </p>
                );

              case "image":
                return (
                  <div key={index} className="my-2">
                    <div className="relative w-full rounded-lg overflow-hidden">
                      <Image
                        src={node.attrs?.src || "/placeholder.svg"}
                        alt={node.attrs?.alt || "Guide image"}
                        width={1200} // Adjust this to your largest expected image width
                        height={300}
                        className="w-full h-[400px] rounded-lg object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                    {node.attrs?.title && (
                      <p className="text-sm text-gray-500 mt-2 text-center italic">
                        {node.attrs.title}
                      </p>
                    )}
                  </div>
                );

              case "heading":
                const level = node.attrs?.level || 2;
                const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
                return (
                  <HeadingTag
                    key={index}
                    className={`font-bold text-gray-900 mt-8 mb-4 ${
                      level === 1
                        ? "text-3xl"
                        : level === 2
                          ? "text-2xl"
                          : level === 3
                            ? "text-xl"
                            : "text-lg"
                    }`}
                  >
                    {node.content?.[0]?.text || ""}
                  </HeadingTag>
                );

              case "bulletList":
                return (
                  <ul
                    key={index}
                    className="list-disc list-inside space-y-2 text-gray-700 ml-4"
                  >
                    {node.content?.map((listItem: any, itemIndex: number) => (
                      <li key={itemIndex}>
                        {listItem.content?.[0]?.content?.[0]?.text || ""}
                      </li>
                    ))}
                  </ul>
                );

              case "orderedList":
                return (
                  <ol
                    key={index}
                    className="list-decimal list-inside space-y-2 text-gray-700 ml-4"
                  >
                    {node.content?.map((listItem: any, itemIndex: number) => (
                      <li key={itemIndex}>
                        {listItem.content?.[0]?.content?.[0]?.text || ""}
                      </li>
                    ))}
                  </ol>
                );

              case "blockquote":
                return (
                  <blockquote
                    key={index}
                    className="border-l-4 border-blue-500 pl-6 italic text-gray-600 my-6 bg-blue-50 py-4 rounded-r-lg"
                  >
                    {node.content?.[0]?.content?.[0]?.text || ""}
                  </blockquote>
                );

              default:
                return null;
            }
          })}
        </div>
      );
    }

    // Fallback for other formats
    return (
      <div className="text-gray-600 leading-relaxed">
        <p>Content format not supported. Please contact support.</p>
      </div>
    );
  }, [content]);

  return <div className="guide-content max-w-none">{renderedContent}</div>;
}
