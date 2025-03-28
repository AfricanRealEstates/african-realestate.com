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
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { EnhancedBlogEditor } from "./PostEditor";
import { useSession } from "next-auth/react";
import { createBlog, updateBlog } from "./post";
import { prisma } from "@/lib/prisma";

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

// Function to fetch blog post by ID
async function fetchBlogById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new Error("Blog post not found");
    }

    return post;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    toast({
      title: "Error",
      description: "Failed to fetch blog post data.",
      variant: "destructive",
    });
    return null;
  }
}

export default function CreateBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordPills, setKeywordPills] = useState<string[]>([]);
  const [availableTopics] = useState([
    { id: "tips", label: "Tips" },
    { id: "finance", label: "Finance" },
    { id: "investing", label: "Investing" },
    { id: "home-decor", label: "Home Decor" },
    { id: "housing", label: "Housing" },
  ]);

  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");
  const [isEditMode, setIsEditMode] = useState(false);

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

  // Fetch blog data if in edit mode
  useEffect(() => {
    const loadBlogData = async () => {
      if (blogId) {
        setIsEditMode(true);

        try {
          // Fetch blog post data from API
          const response = await fetch(`/api/blogs/${blogId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch blog post");
          }

          const blogData = await response.json();

          if (blogData) {
            // Populate form with existing data
            form.reset({
              title: blogData.title,
              content: blogData.content,
              topics: blogData.topics,
              coverPhoto: blogData.coverPhoto || "",
              imageUrls: blogData.imageUrls || [],
              metaDescription: blogData.metaDescription || "",
              metaKeywords: blogData.metaKeywords || "",
              slug: blogData.slug || "",
            });

            // If using keyword pills, populate them too
            if (blogData.metaKeywords) {
              setKeywordPills(
                blogData.metaKeywords
                  .split(",")
                  .map((k: string) => k.trim())
                  .filter(Boolean)
              );
            }
          }
        } catch (error) {
          console.error("Error fetching blog post:", error);
          toast({
            title: "Error",
            description: "Failed to fetch blog post data.",
            variant: "destructive",
          });
        }
      }
    };

    loadBlogData();
  }, [blogId, form]);

  const session = useSession();
  if (!session) {
    router.push("/login");
  }

  // Initialize keyword pills from form data if available
  useEffect(() => {
    const metaKeywords = form.getValues("metaKeywords");
    if (metaKeywords) {
      setKeywordPills(
        metaKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      );
    }
  }, [form]);

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
      let result;

      if (isEditMode && blogId) {
        // Update existing blog - call server action directly
        result = await updateBlog(blogId, values);
      } else {
        // Create new blog
        result = await createBlog(values);
      }

      if (result.error) {
        throw new Error(result.error.toString());
      }

      toast({
        title: "Success",
        description: isEditMode
          ? "Blog post updated successfully!"
          : "Blog post created successfully!",
      });

      router.push("/dashboard/blogs");
    } catch (error) {
      console.error(
        isEditMode ? "Failed to update blog:" : "Failed to create blog:",
        error
      );
      toast({
        title: "Error",
        description: isEditMode
          ? "Failed to update blog. Please try again."
          : "Failed to create blog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  return (
    <main className="pt-6 pb-8 lg:pb-16">
      <div className="mb-12 max-w-7xl m-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <h1 className="text-3xl font-bold mb-8">
          {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
        </h1>

        <Tabs defaultValue="edit" className="mb-6">
          <TabsList>
            <TabsTrigger value="edit" onClick={() => setPreviewMode(false)}>
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" onClick={() => setPreviewMode(true)}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-blue-600 mb-1 block transition-colors duration-150 ease-in-out focus-within:text-blue-600">
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="My Awesome Blog Post"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (!form.getValues("slug")) {
                                form.setValue(
                                  "slug",
                                  generateSlug(e.target.value)
                                );
                              }
                            }}
                          />
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
                        <FormLabel className="text-lg font-semibold text-blue-600 mb-1 block transition-colors duration-150 ease-in-out focus-within:text-blue-600">
                          Slug
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="my-awesome-blog-post"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the URL-friendly version of your title.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>

                <FormField
                  control={form.control}
                  name="coverPhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-600 mb-1 block transition-colors duration-150 ease-in-out focus-within:text-blue-600">
                        Cover Photo
                      </FormLabel>
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
                        <div className="mt-4">
                          <Image
                            src={field.value || "/placeholder.svg"}
                            alt="Cover preview"
                            width={400}
                            height={200}
                            className="rounded-md object-cover border"
                          />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="metaKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-blue-600 mb-1 block transition-colors duration-150 ease-in-out focus-within:text-blue-600">
                          Meta keywords
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                placeholder="e.g. housing, real estate, trending"
                                value={keywordInput}
                                onChange={(e) =>
                                  setKeywordInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    keywordInput.trim()
                                  ) {
                                    e.preventDefault();
                                    const newKeywords = [
                                      ...keywordPills,
                                      keywordInput.trim(),
                                    ];
                                    setKeywordPills(newKeywords);
                                    field.onChange(newKeywords.join(", "));
                                    setKeywordInput("");
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  if (keywordInput.trim()) {
                                    const newKeywords = [
                                      ...keywordPills,
                                      keywordInput.trim(),
                                    ];
                                    setKeywordPills(newKeywords);
                                    field.onChange(newKeywords.join(", "));
                                    setKeywordInput("");
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </div>

                            {keywordPills.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {keywordPills.map((keyword, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {keyword}
                                    <X
                                      className="h-3 w-3 cursor-pointer"
                                      onClick={() => {
                                        const newKeywords = keywordPills.filter(
                                          (_, i) => i !== index
                                        );
                                        setKeywordPills(newKeywords);
                                        field.onChange(newKeywords.join(", "));
                                      }}
                                    />
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          These are the meta keywords of your blog post. Press
                          Enter or click Add to create a keyword pill.
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
                        <FormLabel className="text-lg font-semibold text-blue-600 mb-1 block transition-colors duration-150 ease-in-out focus-within:text-blue-600">
                          Summary Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief description of your blog post"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will appear in search results and social media
                          shares.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-600 mb-1 block transition-colors duration-150 ease-in-out focus-within:text-blue-600">
                        Content
                      </FormLabel>
                      <FormControl>
                        <EnhancedBlogEditor
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
                  name="topics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-600 mb-1 block transition-colors duration-150 ease-in-out focus-within:text-blue-600">
                        Topics
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2 hover:cursor-pointer">
                          {availableTopics.map((topic) => (
                            <Badge
                              key={topic.id}
                              variant={
                                field.value.includes(topic.id)
                                  ? "default"
                                  : "outline"
                              }
                              className={`cursor-pointer ${
                                field.value.includes(topic.id)
                                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                                  : ""
                              }`}
                              onClick={() => {
                                if (field.value.includes(topic.id)) {
                                  field.onChange(
                                    field.value.filter(
                                      (t: string) => t !== topic.id
                                    )
                                  );
                                } else {
                                  field.onChange([...field.value, topic.id]);
                                }
                              }}
                            >
                              {topic.label}
                            </Badge>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select the topics that best describe your blog post.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-600 mb-1 block transition-colors duration-150 ease-in-out focus-within:text-blue-600">
                        Inserted Images
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {field.value && field.value.length > 0 ? (
                            field.value.map((url, index) => (
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
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No images inserted yet
                            </p>
                          )}
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

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditMode ? "Updating..." : "Creating..."}
                      </>
                    ) : isEditMode ? (
                      "Update Blog Post"
                    ) : (
                      "Create Blog Post"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardContent className="pt-6">
                {form.getValues("coverPhoto") && (
                  <div className="mb-6">
                    <Image
                      src={form.getValues("coverPhoto") || "/placeholder.svg"}
                      alt={form.getValues("title")}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover w-full"
                    />
                  </div>
                )}

                <h1 className="text-3xl font-bold mb-4">
                  {form.getValues("title") || "Untitled Blog Post"}
                </h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {form.getValues("topics").map((topic, index) => (
                    <Badge key={index} variant="secondary">
                      {availableTopics.find((t) => t.id === topic)?.label ||
                        topic}
                    </Badge>
                  ))}
                </div>

                {form.getValues("metaDescription") && (
                  <div className="mb-6 italic text-muted-foreground border-l-4 border-blue-500 pl-4 py-2">
                    {form.getValues("metaDescription")}
                  </div>
                )}

                <div
                  className="prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      form.getValues("content") || "<p>No content yet</p>",
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
