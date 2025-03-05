"use client";
import { useUploadThing } from "@/lib/uploadthing";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { profileFormValues } from "@/lib/validation";
import { updateProfile } from "@/actions/updateProfile";
import { PropertiesPage } from "@/lib/types";
import { toast } from "sonner";

type UserQueryData = InfiniteData<PropertiesPage, string | null>;

export function useUpdateProfileMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      image,
    }: {
      values: profileFormValues;
      image?: File;
    }) => {
      return Promise.all([
        updateProfile(values),
        image && startAvatarUpload([image]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0]?.serverData.image;

      const queryFilter: QueryFilters<UserQueryData, Error> = {
        queryKey: ["user"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<UserQueryData>(queryFilter, (oldData) => {
        if (!oldData) return oldData;

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            nextCursor: page.nextCursor,
            properties: page.properties.map((property) => {
              if (property.user.id === updatedUser.id) {
                return {
                  ...property,
                  user: {
                    ...updatedUser,
                    avatar: newAvatarUrl || updatedUser.image,
                  },
                };
              }
              return property;
            }),
          })),
        };
      });

      router.refresh();
      toast.success("Profile updated");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update profile. Please try again");
    },
  });
  return mutation;
}
