"use client";

import { useState, useCallback, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Loader2,
  LinkIcon,
  Code,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CustomImage } from "./image-extension";

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload: (file: File) => Promise<string>;
  onImageUrlsChange: (urls: string[]) => void;
}

export function EnhancedBlogEditor({
  content,
  onChange,
  onImageUpload,
  onImageUrlsChange,
}: BlogEditorProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const updateImageUrls = useCallback(
    (htmlContent: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const images = doc.querySelectorAll("img");
      const urls = Array.from(images)
        .map((img) => img.getAttribute("src") || "")
        .filter(Boolean);
      setImageUrls(urls);
      onImageUrlsChange(urls);
    },
    [onImageUrlsChange]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      CharacterCount,
      Placeholder.configure({
        placeholder: "Start writing your amazing blog post here...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      updateImageUrls(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px]",
      },
    },
  });

  useEffect(() => {
    // Initialize image URLs when the editor is first loaded
    if (editor && content) {
      updateImageUrls(content);
    }
  }, [editor, content, updateImageUrls]);

  const handleImageUpload = async () => {
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const imageUrl = await onImageUpload(file);
        editor
          .chain()
          .focus()
          .setImage({
            src: imageUrl,
            // HTMLAttributes: {
            //   class: "w-full h-[200px] object-cover rounded-md",
            //   style: "height: 200px; width: 100%; object-fit: cover;",
            // },
          })
          .run();

        // Position cursor after the image
        const { state } = editor;
        const currentPos = state.selection.anchor;
        editor.commands.setTextSelection(currentPos);

        // Add a new paragraph after the image
        editor.chain().focus().insertContent("<p></p>").run();

        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } catch (error) {
        console.error("Image upload failed:", error);
        toast({
          title: "Error",
          description: "Image upload failed. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  const handleAddLink = () => {
    if (!editor) return;

    if (linkUrl) {
      // If there's selected text, use that as the link text
      if (editor.state.selection.empty && linkText) {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${linkUrl}" target="_blank">${linkText}</a>`)
          .run();
      } else {
        editor
          .chain()
          .focus()
          .setLink({ href: linkUrl, target: "_blank" })
          .run();
      }

      setLinkUrl("");
      setLinkText("");
      setIsLinkDialogOpen(false);
    }
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="border rounded-md p-4">
      <TooltipProvider>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() => editor.chain().focus().undo().run()}
                  variant="outline"
                  size="icon"
                  disabled={!editor.can().undo()}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() => editor.chain().focus().redo().run()}
                  variant="outline"
                  size="icon"
                  disabled={!editor.can().redo()}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  variant="outline"
                  size="icon"
                  className={editor.isActive("bold") ? "bg-muted" : ""}
                >
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bold</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  variant="outline"
                  size="icon"
                  className={editor.isActive("italic") ? "bg-muted" : ""}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Italic</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  variant="outline"
                  size="icon"
                  className={editor.isActive("code") ? "bg-muted" : ""}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Code</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  variant="outline"
                  size="icon"
                  className={
                    editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""
                  }
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 1</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  variant="outline"
                  size="icon"
                  className={
                    editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""
                  }
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 2</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  variant="outline"
                  size="icon"
                  className={
                    editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""
                  }
                >
                  <Heading3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 3</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  variant="outline"
                  size="icon"
                  className={editor.isActive("bulletList") ? "bg-muted" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  variant="outline"
                  size="icon"
                  className={editor.isActive("orderedList") ? "bg-muted" : ""}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ordered List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  variant="outline"
                  size="icon"
                  className={editor.isActive("blockquote") ? "bg-muted" : ""}
                >
                  <Quote className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Quote</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-center gap-1 mr-2">
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className={editor.isActive("link") ? "bg-muted" : ""}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Link</DialogTitle>
                  <DialogDescription>
                    Enter the URL and optional text for your link
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="link-url" className="text-right">
                      URL
                    </Label>
                    <Input
                      id="link-url"
                      placeholder="https://example.com"
                      className="col-span-3"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="link-text" className="text-right">
                      Text
                    </Label>
                    <Input
                      id="link-text"
                      placeholder="Link text (optional)"
                      className="col-span-3"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsLinkDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleAddLink}>
                    Add Link
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {editor.isActive("link") && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleRemoveLink}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove Link</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  variant="outline"
                  size="icon"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Image</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  variant="outline"
                  size="icon"
                  className={
                    editor.isActive({ textAlign: "left" }) ? "bg-muted" : ""
                  }
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Left</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  variant="outline"
                  size="icon"
                  className={
                    editor.isActive({ textAlign: "center" }) ? "bg-muted" : ""
                  }
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Center</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  variant="outline"
                  size="icon"
                  className={
                    editor.isActive({ textAlign: "right" }) ? "bg-muted" : ""
                  }
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Right</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      <div>
        <EditorContent
          editor={editor}
          className="min-h-[300px] max-h-[600px] overflow-y-auto p-4 border rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent [&_img]:w-full [&_img]:h-[200px] [&_img]:object-cover [&_img]:rounded-md"
        />
        <div className="mt-2 text-sm text-muted-foreground flex justify-between">
          <span>{editor.storage.characterCount.characters()} characters</span>
          <span>{editor.storage.characterCount.words()} words</span>
        </div>
      </div>
    </div>
  );
}
