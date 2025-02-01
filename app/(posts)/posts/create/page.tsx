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
import { createBlog, getPresignedUrl } from "../post";
import { BlogEditor } from "../components/PostEditor";
import Image from "next/image";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters"),
  slug: z
    .string()
    .min(1, "Enter title above to generate slug")
    .max(100, "Slug must not exceed 100 characters"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  topics: z.array(z.string()).min(1, "Select at least one topic"),
  coverPhoto: z.string().url("Please upload a cover photo"),
  published: z.boolean().default(false),
});

const topics = [
  { label: "Housing", value: "housing" },
  { label: "Tips", value: "tips" },
  { label: "Finance", value: "finance" },
  { label: "Investing", value: "investing" },
  { label: "Home Decor", value: "home-decor" },
  // Add more topics as needed
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
    const result = await createBlog(values);
    setIsSubmitting(false);

    if ("error" in result) {
      console.error(result.error);
      toast({
        title: "Error",
        description:
          typeof result.error === "string"
            ? result.error
            : "Failed to create blog. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });
      router.push(`/posts/${result.post.slug}`);
    }
  };

  const handleImageUpload = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const result = await getPresignedUrl(fileName);

    if ("error" in result) {
      throw new Error(result.error);
    }

    const response = await fetch(result.url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/blog/${fileName}`;
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
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="blog-post-slug" {...field} />
                </FormControl>
                <FormDescription>
                  The URL-friendly version of the title.
                </FormDescription>
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
                  />
                </FormControl>
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
                            // Handle error (e.g., show error message to user)
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
                    height={100}
                    width={100}
                    src={field.value || "/placeholder.svg"}
                    alt="Cover preview"
                    className="mt-2 max-w-xs rounded-md"
                  />
                )}
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
            {isSubmitting ? "Creating..." : "Create Blog Post"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
