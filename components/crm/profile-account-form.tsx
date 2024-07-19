"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ImageSchema = z
  .custom<File | undefined>()
  .refine(
    (file) => !file || (file instanceof File && file.type.startsWith("image/")),
    "Only Images Allowed"
  )
  .refine((file) => {
    return !file || file.size < 1024 * 1024 * 5;
  }, "File must be less than 2MB");

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  bio: z.string().max(160).min(4),
  profilePhoto: ImageSchema.optional(),
  xLink: z.string().url({ message: "Please enter a valid URL." }).optional(),
  tiktokLink: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional(),
  facebookLink: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional(),
  linkedinLink: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional(),
  instagramLink: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      xLink: "",
      tiktokLink: "",
    },
  });

  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 shadow-sm"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="john.doe@example.com"
                  {...field}
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tiktokLink"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Tiktok Link (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://" {...field} type="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="xLink"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>X Link (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://" {...field} type="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facebookLink"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Facebook Link (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://" {...field} type="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedinLink"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>LinkedIn Link (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://" {...field} type="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="col-span-2">
          Update profile
        </Button>
      </form>
    </Form>
  );
}
