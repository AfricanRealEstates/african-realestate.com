"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export default function SocialLinks({ form }: { form: UseFormReturn<any> }) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
        <CardDescription>
          Connect your social media accounts (all fields are optional)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="xLink"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 space-y-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-muted">
                <Twitter className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <FormLabel>X (Twitter)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://x.com/username"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facebookLink"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 space-y-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-muted">
                <Facebook className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://facebook.com/username"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagramLink"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 space-y-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-muted">
                <Instagram className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://instagram.com/username"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="youtubeLink"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 space-y-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-muted">
                <Youtube className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <FormLabel>YouTube</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://youtube.com/c/username"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedinLink"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 space-y-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-muted">
                <Linkedin className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://linkedin.com/in/username"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tiktokLink"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 space-y-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                  <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                  <path d="M15 8v8a4 4 0 0 1-4 4" />
                  <line x1="9" y1="16" x2="9" y2="20" />
                </svg>
              </div>
              <div className="flex-1">
                <FormLabel>TikTok</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://tiktok.com/@username"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
