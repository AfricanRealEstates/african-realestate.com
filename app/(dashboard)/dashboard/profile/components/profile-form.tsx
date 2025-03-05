"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { User } from "@prisma/client";

import ProfileDetails from "./profile-details";
import SocialLinks from "./social-links";
import SecuritySettings from "./security-settings";
import ImageUpload from "./image-upload";
import RoleSpecificFields from "./role-specific-fields";
import { updateUserProfile } from "../use-actions";

// Define the form schema based on the User model with all optional fields
const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .optional()
    .nullable(),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .optional()
    .nullable(),
  email: z.string().email("Invalid email address").optional().nullable(),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .nullable(),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),

  // Social links
  xLink: z.string().url("Must be a valid URL").optional().nullable(),
  tiktokLink: z.string().url("Must be a valid URL").optional().nullable(),
  facebookLink: z.string().url("Must be a valid URL").optional().nullable(),
  youtubeLink: z.string().url("Must be a valid URL").optional().nullable(),
  linkedinLink: z.string().url("Must be a valid URL").optional().nullable(),
  instagramLink: z.string().url("Must be a valid URL").optional().nullable(),

  // Agency specific fields
  agentName: z.string().optional().nullable(),
  agentEmail: z.string().email("Invalid email address").optional().nullable(),
  agentLocation: z.string().optional().nullable(),
  officeLine: z.string().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),
  showAgentContact: z.boolean().optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || undefined,
      username: user.username || undefined,
      email: user.email || undefined,
      bio: user.bio || undefined,
      phoneNumber: user.phoneNumber || undefined,
      address: user.address || undefined,
      postalCode: user.postalCode || undefined,

      // Social links
      xLink: user.xLink || undefined,
      tiktokLink: user.tiktokLink || undefined,
      facebookLink: user.facebookLink || undefined,
      youtubeLink: user.youtubeLink || undefined,
      linkedinLink: user.linkedinLink || undefined,
      instagramLink: user.instagramLink || undefined,

      // Agency specific fields
      agentName: user.agentName || undefined,
      agentEmail: user.agentEmail || undefined,
      agentLocation: user.agentLocation || undefined,
      officeLine: user.officeLine || undefined,
      whatsappNumber: user.whatsappNumber || undefined,
      showAgentContact: user.showAgentContact || undefined,
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    try {
      console.log("Submitting form data:", data);

      // Use server action directly
      const result = await updateUserProfile(user.id, data);

      if (!result.success) {
        throw new Error(result.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        `Failed to update profile: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-8 md:grid-cols-[1fr_3fr]">
          <div>
            <ImageUpload profileImage={user.profilePhoto} userId={user.id} />
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="social">Social Links</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <ProfileDetails form={form} />

                {(user.role === "AGENCY" || user.role === "ADMIN") && (
                  <RoleSpecificFields form={form} role={user.role} />
                )}
              </TabsContent>

              <TabsContent value="social" className="space-y-6">
                <SocialLinks form={form} />
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <SecuritySettings
                  userId={user.id}
                  hasPassword={!!user.password}
                />
              </TabsContent>
            </Tabs>

            <Card>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
