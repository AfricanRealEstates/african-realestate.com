import React from "react";
import ReactMarkdown from "react-markdown";
interface MarkdownProps {
  children: string;
}

export default function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      className="space-y-3"
      components={{
        ul: (props) => <ul className="list-inside list-disc" {...props} />,
        li: (props) => <li className="list-inside list-disc" {...props} />,
        a: (props) => (
          <a {...props} className="text-blue-400 underline" target="_blank" />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
