"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import Image from "next/image";
import { createBlog } from "../post";
import { BlogEditor } from "../components/PostEditor";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters"),
  slug: z.string(),
  content: z.string().min(100, "Content must be at least 100 characters"),
  topics: z.array(z.string()).min(1, "Select at least one topic"),
  coverPhoto: z.string().url("Please upload a cover photo"),
  published: z.boolean().default(false),
  imageUrls: z.array(z.string().url()).default([]),
});

const topics = [
  { label: "Housing", value: "housing" },
  { label: "Tips", value: "tips" },
  { label: "Finance", value: "finance" },
  { label: "Investing", value: "investing" },
  { label: "Home Decor", value: "home-decor" },
];

export default function CreateBlogPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      topics: [],
      coverPhoto: "",
      published: false,
      imageUrls: [],
    },
  });

  const title = form.watch("title");

  useEffect(() => {
    if (title) {
      const slug = slugify(title, { lower: true, strict: true });
      form.setValue("slug", slug);
    }
  }, [title, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await createBlog(values);
      if ("error" in result) {
        throw new Error(result.error as any);
      }
      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });
      router.push(`/posts/${result.post.slug}`);
    } catch (error) {
      console.error("Failed to create blog:", error);
      toast({
        title: "Error",
        description: "Failed to create blog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload-media", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  };

  return (
    <div className="pt-16">
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter blog title" {...field} />
                </FormControl>
                <FormDescription>
                  This will be used to generate the blog&apos;s URL.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverPhoto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Photo</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await handleImageUpload(file);
                            field.onChange(url);
                          } catch (error) {
                            console.error(
                              "Failed to upload cover photo:",
                              error
                            );
                            toast({
                              title: "Error",
                              description:
                                "Failed to upload cover photo. Please try again.",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                    />
                    {field.value && (
                      <Button
                        variant="destructive"
                        onClick={() => field.onChange("")}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </FormControl>
                {field.value && (
                  <Image
                    src={field.value || "/placeholder.svg"}
                    alt="Cover preview"
                    width={200}
                    height={100}
                    className="mt-2 rounded-md object-cover"
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <BlogEditor
                    content={field.value}
                    onChange={field.onChange}
                    onImageUpload={handleImageUpload}
                    onImageUrlsChange={(urls) =>
                      form.setValue("imageUrls", urls)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inline Images</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((url, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Inline image ${index + 1}`}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-0 right-0"
                          onClick={() => {
                            const newUrls = field.value.filter(
                              (_, i) => i !== index
                            );
                            form.setValue("imageUrls", newUrls);
                          }}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormDescription>
                  These are the images inserted in your content. You can remove
                  them here if needed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topics</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <Badge
                        key={topic.value}
                        variant={
                          field.value.includes(topic.value)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => {
                          const newValue = field.value.includes(topic.value)
                            ? field.value.filter((t) => t !== topic.value)
                            : [...field.value, topic.value];
                          field.onChange(newValue);
                        }}
                      >
                        {topic.label}
                      </Badge>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Publish immediately</FormLabel>
                  <FormDescription>
                    If unchecked, the post will be saved as a draft.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-1" /> Creating...
              </>
            ) : (
              "Create Blog Post"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
