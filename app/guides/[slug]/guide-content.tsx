"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { JSX } from "react/jsx-runtime";

interface GuideContentProps {
  content: any;
}

export function GuideContent({ content }: GuideContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Function to render content recursively
  const renderContent = (node: any) => {
    if (!node) return null;

    if (node.type === "doc") {
      return (
        <div className="prose prose-blue max-w-none">
          {node.content?.map((child: any, index: number) =>
            renderContent(child)
          )}
        </div>
      );
    }

    if (node.type === "paragraph") {
      return (
        <p key={Math.random()} className="mb-4">
          {node.content?.map((child: any, index: number) =>
            renderContent(child)
          )}
        </p>
      );
    }

    if (node.type === "heading") {
      const HeadingTag = `h${node.attrs.level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag key={Math.random()} className="mt-8 mb-4">
          {node.content?.map((child: any, index: number) =>
            renderContent(child)
          )}
        </HeadingTag>
      );
    }

    if (node.type === "bulletList") {
      return (
        <ul key={Math.random()} className="list-disc pl-6 mb-4">
          {node.content?.map((child: any, index: number) =>
            renderContent(child)
          )}
        </ul>
      );
    }

    if (node.type === "orderedList") {
      return (
        <ol key={Math.random()} className="list-decimal pl-6 mb-4">
          {node.content?.map((child: any, index: number) =>
            renderContent(child)
          )}
        </ol>
      );
    }

    if (node.type === "listItem") {
      return (
        <li key={Math.random()}>
          {node.content?.map((child: any, index: number) =>
            renderContent(child)
          )}
        </li>
      );
    }

    if (node.type === "image") {
      return (
        <div key={Math.random()} className="my-8 relative">
          <Image
            src={node.attrs.src || "/placeholder.svg"}
            alt={node.attrs.alt || "Guide image"}
            width={800}
            height={450}
            className="rounded-lg mx-auto"
          />
        </div>
      );
    }

    if (node.type === "text") {
      let content = node.text;

      if (node.marks) {
        for (const mark of node.marks) {
          if (mark.type === "bold") {
            content = <strong key={Math.random()}>{content}</strong>;
          } else if (mark.type === "italic") {
            content = <em key={Math.random()}>{content}</em>;
          } else if (mark.type === "link") {
            content = (
              <a
                key={Math.random()}
                href={mark.attrs.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {content}
              </a>
            );
          }
        }
      }

      return content;
    }

    return null;
  };

  return renderContent(content);
}
