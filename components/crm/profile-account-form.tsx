"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ImgCrop from "antd-img-crop";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { profileFormSchema } from "@/lib/validation";
import { Upload } from "antd";
import { useState } from "react";
import {
  uploadFilesToFirebase,
  uploadSingleFileToFirebase,
} from "@/lib/utils/upload-media";
import { updateIndividualAccount } from "@/actions/update-dashboard-settings";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { Icons } from "../globals/icons";

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type ExtendedUser = User & {
  profilePhoto?: string;
  whatsappNumber?: string;
  phoneNumber?: string;
  xLink?: string;
  tiktokLink?: string;
  facebookLink?: string;
  linkedinLink?: string;
  instagramLink?: string;
  bio?: string;
};

interface UserUpdateFormProps {
  user: Pick<
    User,
    | "id"
    | "name"
    | "email"
    | "whatsappNumber"
    | "phoneNumber"
    | "profilePhoto"
    | "xLink"
    | "facebookLink"
    | "instagramLink"
    | "linkedinLink"
    | "tiktokLink"
    | "bio"
  >;
}

export default function ProfileForm({ user }: UserUpdateFormProps) {
  const [tempProfile, setTempProfile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateUserNameWithId = updateIndividualAccount.bind(
    null,
    user.id as string
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      profilePhoto: user?.profilePhoto || "",
      name: user?.name || "",
      email: user?.email || "",
      whatsappNumber: user?.whatsappNumber || "",
      phoneNumber: user?.phoneNumber || "",
      xLink: user?.xLink || "",
      tiktokLink: user?.tiktokLink || "",
      facebookLink: user?.facebookLink || "",
      linkedinLink: user?.linkedinLink || "",
      instagramLink: user?.instagramLink || "",

      bio: user?.bio || "",
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    try {
      setIsLoading(true);
      let profilePhotoUrl = "";
      if (tempProfile) {
        profilePhotoUrl = await uploadSingleFileToFirebase(tempProfile);
      }

      const formData = {
        ...values,
        profilePhoto: profilePhotoUrl || values.profilePhoto,
      };

      console.log(formData);
      await updateUserNameWithId(formData);

      // Handle success (e.g., show a success message or redirect)
      toast.success("Your profile information  has been updated!");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Error while updating profile information");
      // Handle error (e.g., show an error message)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 shadow-sm mb-16"
      >
        <div className="col-span-2">
          <ImgCrop showGrid rotationSlider aspectSlider showReset>
            <Upload
              listType="picture-circle"
              maxCount={1}
              beforeUpload={(file: any) => {
                setTempProfile(file);
                form.setValue("profilePhoto", file);
                return false;
              }}
            >
              Upload Profile
            </Upload>
          </ImgCrop>
        </div>
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
          name="whatsappNumber"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Whatsapp Number</FormLabel>
              <FormControl>
                <Input placeholder="Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Phone Number" {...field} />
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

        <h2 className="my-4 col-span-2 text-3xl font-medium">Socials</h2>
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

        <Button type="submit" className="col-span-2" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
          <span>{isLoading ? "Saving" : "Update Profile"}</span>
        </Button>
      </form>
    </Form>
  );
}
