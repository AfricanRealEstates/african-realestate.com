"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { addBlogSchema } from "@/lib/formschema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RichTextEditor from "@/components/globals/rich-text-editor";
import { draftToMarkdown } from "markdown-draft-js";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createBlogPosting } from "@/actions/blog";
export default function BlogForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof addBlogSchema>>({
    resolver: zodResolver(addBlogSchema),
  });

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof addBlogSchema>) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    try {
      setIsLoading(true);
      await createBlogPosting(formData);
      toast.success("Your blog post has been submitted!");
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  }
  return (
    <>
      <section className="mt-8">
        <Form {...form}>
          <form
            className="space-y-4"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blog Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Property Management in 2024"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="image"
              render={({ field: { value, ...fieldValues } }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      {...fieldValues}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        fieldValues.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label onClick={() => setFocus("description")}>Content</Label>
                  <FormControl>
                    <RichTextEditor
                      onChange={(draft) =>
                        field.onChange(draftToMarkdown(draft))
                      }
                      ref={field.ref}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>Submit</>
              )}
            </Button>
          </form>
        </Form>
      </section>
    </>
    // <form action={addBlog} className="space-y-8 mt-8">
    //   <div className="space-y-2">
    //     <Label htmlFor="title">Title</Label>
    //     <Input type="text" id="title" name="title" required />
    //   </div>
    //   <div className="space-y-2">
    //     <Label htmlFor="image">Image</Label>
    //     <Input type="file" id="image" name="image" required />
    //   </div>
    //   <div className="space-y-2">
    //     <Label htmlFor="description">Description</Label>
    //     <Textarea id="description" name="description" required />
    //   </div>
    //   <Button type="submit">Save</Button>
    // </form>
  );
}
