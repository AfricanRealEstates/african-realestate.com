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
    defaultValues: { name: user.name || "" },
  });

  async function onSubmit(data: UpdateUserInput) {
    try {
      setIsLoading(true);
      await updateProfile(data);
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
            className="max-w-sm space-y-2.5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a username" {...field} />
                  </FormControl>
                  <FormDescription>Your public username</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button color="blue" type="submit" disabled={isLoading}>
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
