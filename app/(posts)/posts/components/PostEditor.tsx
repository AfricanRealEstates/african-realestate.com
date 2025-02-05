"use client";

import { useState, useCallback, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type React from "react";

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload: (file: File) => Promise<string>;
  onImageUrlsChange: (urls: string[]) => void;
}

export function BlogEditor({
  content,
  onChange,
  onImageUpload,
  onImageUrlsChange,
}: BlogEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      updateImageUrls(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose focus:outline-none",
      },
    },
  });

  const updateImageUrls = useCallback(
    (html: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const images = doc.getElementsByTagName("img");
      const urls = Array.from(images).map((img) => img.src);
      setImageUrls(urls);
      onImageUrlsChange(urls);
    },
    [onImageUrlsChange]
  );

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setIsUploading(true);
        try {
          const url = await onImageUpload(file);
          editor?.chain().focus().setImage({ src: url }).run();
          const newImageUrls = [...imageUrls, url];
          setImageUrls(newImageUrls);
          onImageUrlsChange(newImageUrls);
        } catch (error) {
          console.error("Failed to upload image:", error);
          // Handle error (e.g., show error message to user)
        } finally {
          setIsUploading(false);
        }
      }
    },
    [editor, imageUrls, onImageUpload, onImageUrlsChange]
  );

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      updateImageUrls(content);
    }
  }, [editor, content, updateImageUrls]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center space-x-2 mb-4">
        {[
          {
            icon: Bold,
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive("bold"),
          },
          {
            icon: Italic,
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive("italic"),
          },
          {
            icon: List,
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive("bulletList"),
          },
          {
            icon: ListOrdered,
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive("orderedList"),
          },
          {
            icon: Heading1,
            action: () =>
              editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: editor.isActive("heading", { level: 1 }),
          },
          {
            icon: Heading2,
            action: () =>
              editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive("heading", { level: 2 }),
          },
          {
            icon: Heading3,
            action: () =>
              editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: editor.isActive("heading", { level: 3 }),
          },
        ].map((item, index) => (
          <Button
            key={index}
            variant="outline"
            size="icon"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              item.action();
            }}
            className={item.isActive ? "bg-muted" : ""}
          >
            <item.icon className="h-4 w-4" />
          </Button>
        ))}
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("image-upload")?.click();
            }}
            disabled={isUploading}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="min-h-[300px] max-h-[600px] overflow-y-auto"
      />
    </div>
  );
}
