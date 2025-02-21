"use client";
import { useState } from "react";
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
import Image from "next/image";
import { createBlog } from "./post";
import { Loader2 } from "lucide-react";
import { BlogEditor } from "./PostEditor";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  topics: z.array(z.string()).min(1, {
    message: "Please select at least one topic.",
  }),
  coverPhoto: z.string(),
  imageUrls: z.array(z.string()).optional().default([]),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  slug: z.string().optional(),
});

export default function CreateBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      topics: [],
      coverPhoto: "",
      imageUrls: [],
      metaDescription: "",
      metaKeywords: "",
      slug: "",
    },
  });

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

  const handleImageDelete = async (url: string) => {
    const fileName = url.split("/").pop();
    if (!fileName) return;

    const response = await fetch(`/api/upload-media?fileName=${fileName}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }
  };

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
      router.push(`/blog/${result.post.topics[0]}/${result.post.slug}`);
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

  return (
    <main className={`pt-6 pb-8 lg:pb-16`}>
      <div className="mb-12 max-w-7xl m-auto px-6 text-gray-600 md:px-12 xl:px-6">
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
                    <Input placeholder="My Awesome Blog Post" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the title of your blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="my-awesome-blog-post"
                      {...field}
                      onBlur={(e) => {
                        if (!field.value) {
                          const slug = slugify(form.getValues("title"), {
                            lower: true,
                          });
                          form.setValue("slug", slug);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the URL-friendly version of your title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
                              if (field.value) {
                                await handleImageDelete(field.value);
                              }
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
                          onClick={async () => {
                            try {
                              await handleImageDelete(field.value!);
                              field.onChange("");
                            } catch (error) {
                              console.error(
                                "Failed to delete cover photo:",
                                error
                              );
                              toast({
                                title: "Error",
                                description:
                                  "Failed to delete cover photo. Please try again.",
                                variant: "destructive",
                              });
                            }
                          }}
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
                      className="mt-2 rounded-md object-cover border"
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Keywords</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. housing, real estate, trending"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    These are the meta keywords of your blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="A brief description of your blog post"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    This is the meta description of your blog post.
                  </FormDescription> */}
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
                  <FormDescription>Write your heart out!</FormDescription>
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
                            width={100}
                            height={100}
                            className="rounded-md object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-0 right-0"
                            onClick={async () => {
                              try {
                                await handleImageDelete(url);
                                const newUrls = field.value.filter(
                                  (_, i) => i !== index
                                );
                                form.setValue("imageUrls", newUrls);
                              } catch (error) {
                                console.error(
                                  "Failed to delete inline image:",
                                  error
                                );
                                toast({
                                  title: "Error",
                                  description:
                                    "Failed to delete inline image. Please try again.",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            X
                          </Button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    These are the images inserted in your content. You can
                    remove them here if needed.
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
                    <div className="flex flex-wrap gap-2 hover:cursor-pointer">
                      <Badge
                        variant={
                          field.value.includes("tips") ? "secondary" : "outline"
                        }
                        onClick={() => {
                          if (field.value.includes("tips")) {
                            field.onChange(
                              field.value.filter(
                                (topic: string) => topic !== "tips"
                              )
                            );
                          } else {
                            field.onChange([...field.value, "tips"]);
                          }
                        }}
                      >
                        Tips
                      </Badge>
                      <Badge
                        variant={
                          field.value.includes("finance")
                            ? "secondary"
                            : "outline"
                        }
                        onClick={() => {
                          if (field.value.includes("finance")) {
                            field.onChange(
                              field.value.filter(
                                (topic: string) => topic !== "finance"
                              )
                            );
                          } else {
                            field.onChange([...field.value, "finance"]);
                          }
                        }}
                      >
                        Finance
                      </Badge>
                      <Badge
                        variant={
                          field.value.includes("investing")
                            ? "secondary"
                            : "outline"
                        }
                        onClick={() => {
                          if (field.value.includes("investing")) {
                            field.onChange(
                              field.value.filter(
                                (topic: string) => topic !== "investing"
                              )
                            );
                          } else {
                            field.onChange([...field.value, "investing"]);
                          }
                        }}
                      >
                        Investing
                      </Badge>
                      <Badge
                        variant={
                          field.value.includes("home-decor")
                            ? "secondary"
                            : "outline"
                        }
                        onClick={() => {
                          if (field.value.includes("home-decor")) {
                            field.onChange(
                              field.value.filter(
                                (topic: string) => topic !== "home-decor"
                              )
                            );
                          } else {
                            field.onChange([...field.value, "home-decor"]);
                          }
                        }}
                      >
                        Home Decor
                      </Badge>
                      <Badge
                        variant={
                          field.value.includes("housing")
                            ? "secondary"
                            : "outline"
                        }
                        onClick={() => {
                          if (field.value.includes("housing")) {
                            field.onChange(
                              field.value.filter(
                                (topic: string) => topic !== "housing"
                              )
                            );
                          } else {
                            field.onChange([...field.value, "housing"]);
                          }
                        }}
                      >
                        Housing
                      </Badge>
                    </div>
                  </FormControl>
                  {/* <FormDescription>
                    Select the topics that best describe your blog post.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Create Blog Post"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
