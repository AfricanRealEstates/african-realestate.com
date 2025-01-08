"use client";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { updateUserSchema, UpdateUserInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "@/actions/updateProfile";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../utils/Button";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface SettingsPageProps {
  user: User;
}

export default function SettingsUpdatedForm({ user }: SettingsPageProps) {
  const { toast } = useToast();
  const session = useSession();
  console.log(session);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    // TODO: Add default value from current user
    defaultValues: {
      agentName: user.agentName || "",
      agentEmail: user.agentEmail || "",
      officeLine: user.officeLine || "",
      whatsappNumber: user.whatsappNumber || "",
      address: user.address || "",
      postalCode: user.postalCode || "",
      bio: user.bio || "",
    },
  });

  async function onSubmit(data: UpdateUserInput) {
    try {
      setIsLoading(true);
      // await updateProfile(data);
      toast({ title: "Success.", description: "Profile updated." });
      session.update();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        description: "An error occurred. Please try again",
      });
    }
  }

  return (
    <main className="px-3 py-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-2xl  space-y-2.5"
          >
            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a username" {...field} />
                  </FormControl>
                  <FormDescription>Your public name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agentEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Agent Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="officeLine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Line</FormLabel>
                  <FormControl>
                    <Input placeholder="Office Line" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whatsapp Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Whatsapp Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Postal code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
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
            <Button
              color="blue"
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin size-4" />
                  Saving
                </div>
              ) : (
                <>Save information</>
              )}
            </Button>
          </form>
        </Form>
      </section>
    </main>
  );
}
