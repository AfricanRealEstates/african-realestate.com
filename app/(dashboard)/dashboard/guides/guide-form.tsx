"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { createGuide, updateGuide, type GuideFormData } from "./actions";
import { uploadToS3 } from "@/lib/utils/s3-operations";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Import the rich text editor dynamically to avoid SSR issues
const RichTextEditor = dynamic(() => import("./rich-text-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 border rounded-md bg-muted/20">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

// Form schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.any(), // JSON content from rich text editor
  propertyType: z.string({
    required_error: "Please select a property type",
  }),
  guideType: z.string({
    required_error: "Please select a guide type",
  }),
  published: z.boolean().default(false),
  coverImage: z.string().nullable().optional(),
  images: z.array(z.string()).default([]),
});

interface GuideFormProps {
  guide?: any; // The guide data for editing
}

export function GuideForm({ guide }: GuideFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    guide?.coverImage || null
  );
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with existing guide data or defaults
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: guide?.title || "",
      content: guide?.content || {},
      propertyType: guide?.propertyType || "",
      guideType: guide?.guideType || "",
      published: guide?.published || false,
      coverImage: guide?.coverImage || null,
      images: guide?.images || [],
    },
  });

  // Handle cover image upload
  const handleCoverImageUpload = async (file: File) => {
    if (!file) return null;

    setUploadingCover(true);
    try {
      // Generate a unique key for the image
      const timestamp = Date.now();
      const key = `guides/cover/${timestamp}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;

      // Upload to S3
      const result = await uploadToS3(file, key);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Return the URL
      return result.data.fileUrl;
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast.error("Failed to upload cover image");
      return null;
    } finally {
      setUploadingCover(false);
    }
  };

  // Handle content image upload (for rich text editor)
  const handleContentImageUpload = useCallback(
    async (file: File): Promise<string> => {
      try {
        // Generate a unique key for the image
        const timestamp = Date.now();
        const key = `guides/content/${timestamp}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;

        // Upload to S3
        const result = await uploadToS3(file, key);

        if (!result.success) {
          throw new Error(result.message);
        }

        // Add to form images array
        const currentImages = form.getValues("images") || [];
        form.setValue("images", [...currentImages, result.data.fileUrl]);

        // Return the URL for the editor
        return result.data.fileUrl;
      } catch (error) {
        console.error("Error uploading content image:", error);
        toast.error("Failed to upload image");
        throw error;
      }
    },
    [form]
  );

  // Handle cover image change
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setCoverImageFile(file);
  };

  // Remove cover image
  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
    form.setValue("coverImage", null);
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Upload cover image if changed
      let coverImageUrl = values.coverImage;
      if (coverImageFile) {
        coverImageUrl = await handleCoverImageUpload(coverImageFile);
      }

      // Ensure content is a serializable object by converting it to a string and back
      // This prevents issues with complex objects that can't be passed to Server Actions
      const serializedContent = JSON.stringify(values.content);
      const parsedContent = JSON.parse(serializedContent);

      // Prepare data for submission
      const guideData: GuideFormData = {
        ...values,
        content: parsedContent,
        coverImage: coverImageUrl,
      };

      // Create or update guide
      const result = guide
        ? await updateGuide(guide.id, guideData)
        : await createGuide(guideData);

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast.success(
        guide ? "Guide updated successfully" : "Guide created successfully"
      );
      router.push("/dashboard/guides");
    } catch (error) {
      console.error("Error submitting guide:", error);
      toast.error(guide ? "Failed to update guide" : "Failed to create guide");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Guide title" {...field} />
                  </FormControl>
                  <FormDescription>
                    The title of your guide as it will appear on the website.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Cover Image</FormLabel>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => coverImageInputRef.current?.click()}
                    disabled={uploadingCover}
                    className="w-full sm:w-auto"
                  >
                    {uploadingCover ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Cover Image
                      </>
                    )}
                  </Button>
                  <input
                    type="file"
                    ref={coverImageInputRef}
                    onChange={handleCoverImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {coverImagePreview && (
                  <div className="relative w-full max-w-md h-48 mt-2 border rounded-md overflow-hidden">
                    <Image
                      src={coverImagePreview || "/placeholder.svg"}
                      alt="Cover image preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeCoverImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {!coverImagePreview && (
                  <div className="flex items-center justify-center w-full max-w-md h-48 border rounded-md border-dashed bg-muted/20">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <ImageIcon className="h-10 w-10 mb-2" />
                      <p>No cover image selected</p>
                    </div>
                  </div>
                )}
              </div>
              <FormDescription>
                Upload a cover image for your guide. Recommended size:
                1200x630px.
              </FormDescription>
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      onImageUpload={handleContentImageUpload}
                    />
                  </FormControl>
                  <FormDescription>
                    Write your guide content. You can add text, images, and
                    formatting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 pt-4">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Residential">
                            Residential
                          </SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                          <SelectItem value="Vacational / Social">
                            Vacational / Social
                          </SelectItem>
                          <SelectItem value="Land">Land</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the property type this guide is for.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guideType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guide Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select guide type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sale">For Sale</SelectItem>
                          <SelectItem value="rent">For Rent</SelectItem>
                          <SelectItem value="sell">To Sell</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select whether this guide is for buying, renting, or
                        selling properties.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Published</FormLabel>
                        <FormDescription>
                          Make this guide visible on the website.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/guides")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {guide ? "Updating..." : "Creating..."}
              </>
            ) : guide ? (
              "Update Guide"
            ) : (
              "Create Guide"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
