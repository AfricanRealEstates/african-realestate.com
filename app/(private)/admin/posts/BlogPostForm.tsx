"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { createPost, editPost } from "@/actions/blog";
import { Loader2 } from "lucide-react";
import TipTapMenuBar from "./TipTapMenuBar";
import TopicSelector from "./TopicSelector";

interface Post {
  id: string;
  title: string;
  content: string;
  topics: string[];
  imageUrls: string[];
  published: boolean;
  likes: { id: string }[];
  viewCount: number;
  shareCount: number;
}

interface BlogPostFormProps {
  post?: Post;
}

const AVAILABLE_TOPICS = [
  "housing",
  "tips",
  "finance",
  "investing",
  "home decor",
];

export default function BlogPostForm({ post }: BlogPostFormProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [topics, setTopics] = useState<string[]>(post?.topics || []);
  const [published, setPublished] = useState(post?.published || false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: post?.content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none",
      },
    },
    injectCSS: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("content", editor?.getHTML() || "");
    formData.set("topics", JSON.stringify(topics));

    try {
      if (post) {
        await editPost(post.id, formData);
      } else {
        await createPost(formData);
      }
      toast({
        title: "Success",
        description: `Blog post ${post ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${post ? "update" : "create"} blog post`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const likeCount = post?.likes.length || 0;
  const viewCount = post?.viewCount || 0;
  const shareCount = post?.shareCount || 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-lg font-semibold">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1"
          placeholder="Enter your blog post title"
        />
      </div>
      <div>
        <Label className="text-lg font-semibold mb-2 block">Topics</Label>
        <TopicSelector
          availableTopics={AVAILABLE_TOPICS}
          selectedTopics={topics}
          onChange={setTopics}
        />
      </div>
      <div>
        <Label htmlFor="content" className="text-lg font-semibold">
          Content
        </Label>
        <div className="border rounded-md mt-1 overflow-hidden">
          <TipTapMenuBar editor={editor} />
          <EditorContent editor={editor} className="min-h-[300px] p-4" />
        </div>
      </div>
      <div>
        <Label htmlFor="image" className="text-lg font-semibold">
          Cover Image
        </Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="mt-1"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="published"
          name="published"
          checked={published}
          onCheckedChange={(checked) => setPublished(checked as boolean)}
        />
        <Label htmlFor="published">Publish immediately</Label>
      </div>
      {post && (
        <div className="mt-4 space-y-2">
          <p>Likes: {likeCount}</p>
          <p>Views: {viewCount}</p>
          <p>Shares: {shareCount}</p>
        </div>
      )}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {post ? "Updating" : "Creating"}...
          </>
        ) : (
          <>{post ? "Update" : "Create"} Post</>
        )}
      </Button>
    </form>
  );
}
